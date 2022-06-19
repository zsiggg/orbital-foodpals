import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { supabase } from '../../../api'
import { useRouter } from 'next/router'
import { useAlert } from '../../../helpers/alertContext'
import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'

type IncomingOrderDto = {
  id: number
  restaurants: RestaurantDto
  order_text: string
  deliverer_id: string
  ordered_at: Date
  is_active: boolean
  destinations: DestinationDto
  cost: number
}

type RestaurantDto = {
  id: number
  name: string
}

type DestinationDto = {
  id: number
  name: string
}

const IncomingOrder = ({ user }) => {
  const router = useRouter()
  const [alert, setAlert] = useAlert()

  // will be passed in from the homescreen, when the user selects the incoming order
  const { id } = router.query
  const orderId: number = Number(id)

  const [order, setOrder]: [
    IncomingOrderDto,
    Dispatch<SetStateAction<IncomingOrderDto>>,
  ] = useState()

  // simulate api call, pass in props.id
  useEffect(() => {
    const query = async () => {
      const { data: ordersData, error: ordersError } = await supabaseClient
        .from<IncomingOrderDto>('orders')
        .select(
          'id, restaurants (id, name), order_text, ordered_at, is_active, destinations (id, name), cost',
        )
        .eq('id', orderId)
        .is('deliverer_id', null)
        .limit(1)
        .single()

      if (ordersError) {
        router.push('/home')
        setAlert({
          type: 'warning',
          message: ordersError.code + ': ' + ordersError.message,
        })
        console.log(ordersError)
        return
      }

      // means a deliverer has already takent the order
      if (ordersData.deliverer_id) {
        router.push('/home')
        setAlert({ type: 'info', message: 'Order has been taken' })
        return
      }

      console.log(ordersData)

      setOrder({ ...ordersData, ordered_at: new Date(ordersData.ordered_at) })
    }

    query()

    //not best practice, need to figure out how to handle this
  }, [])

  async function handleReject() {
    console.log(
      'store in db rejected, never show this order on the homescreen again',
    )
    let error = ''
    const { error: removePendingError } = await supabaseClient.rpc(
      'remove_pending_order',
      { order_id: id, user_id: user.id },
    )
    if (removePendingError) {
      error +=
        removePendingError.code + ': ' + removePendingError.message + '\n'
    }
    const { error: addRejectedError } = await supabaseClient.rpc(
      'add_rejected_user',
      { order_id: id, user_id: user.id },
    )
    if (addRejectedError) {
      error += addRejectedError.code + ': ' + addRejectedError.message
    }

    if (error) {
      setAlert({ type: 'warning', message: error })
    } else {
      setAlert({ type: 'info', message: 'Rejected order' })
    }
    router.push('/home')
  }

  async function handleAccept() {
    // implement auth to get the user uid
    const { data: updatedOrdersData, error: updatedOrdersError } =
      await supabaseClient
        .from('orders')
        .update({ id: id, deliverer_id: user.id })
        .eq('id', id)
        .is('is_active', true)
        .is('deliverer_id', null)

    // possible that order has been taken or completed
    if (updatedOrdersError) {
      const { data: ordersData, error: ordersError } = await supabaseClient
        .from<IncomingOrderDto>('orders')
        .select(
          'id, restaurant_id, order_text, deliverer_id, ordered_at, is_active, destination_id, cost',
        )
        .filter('id', 'eq', orderId)
        .filter('deliverer_id', 'is', 'NULL')
      if (ordersError) {
        router.push('/home')
        setAlert({
          type: 'warning',
          message: ordersError.code + ': ' + ordersError.message,
        })
        console.log(ordersError)
      }

      if (ordersData.length == 0) {
        router.push('/home')
        setAlert({ type: 'info', message: 'Order has been taken' })
      }
    } else {
      router.push('/home')
      setAlert({ type: 'success', message: 'Accepted order' })
    }

    // remove order from pending_orders array in users table
    const { error } = await supabaseClient.rpc('remove_pending_order', {
      order_id: id,
      user_id: user.id,
    })
    if (error) {
      console.log(error)
    }
  }

  return (
    <>
      <section className="flex flex-col h-screen justify-center sm:h-auto sm:justify-start items-center space-y-5 sm:mt-8">
        <section className="border border-gray-300 p-5 rounded-md max-w-xs sm:max-w-md">
          {!order && <p>Loading...</p>}

          {order && (
            <div className="flex flex-col space-y-3">
              <div className="font-bold text-xl">
                <p>Order #{order.id}</p>
                <p>{order.ordered_at.toUTCString()}</p>
              </div>
              <div className="leading-relaxed">
                <p>{order.restaurants.name}</p>
                <p>{order.destinations.name}</p>
                <p>{order.cost}</p>
              </div>
              <div className="leading-snug break-words">
                <p>{order.order_text}</p>
              </div>
            </div>
          )}
        </section>

        <section className="flex space-x-16">
          <button
            className="py-2 px-3 bg-red-600 text-sm text-white font-medium rounded-lg border hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in duration-100"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="py-2 px-3 bg-green-600 text-sm text-white font-medium rounded-lg border hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in duration-100"
            onClick={handleAccept}
          >
            Accept
          </button>
        </section>
      </section>
    </>
  )
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
export default IncomingOrder
