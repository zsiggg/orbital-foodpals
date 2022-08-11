import { IncomingOrderDto } from 'types/index'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAlert } from '../../../contexts/AlertContext'
import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'

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

  useEffect(() => {
    const query = async () => {
      const { data: ordersData, error: ordersError } = await supabaseClient
        .from<IncomingOrderDto>('orders')
        .select(
          '*, restaurant:restaurant_id(id, name), deliverer:deliverer_id(id, name), destination:destination_id(id, name)',
        )
        .eq('id', orderId)
        .limit(1)
        .single()

      if (ordersError) {
        setAlert({
          type: 'warning',
          message: ordersError.code + ': ' + ordersError.message,
          displayNow: false,
        })
        router.push('/deliverer/home')
        console.log(ordersError)
        return
      }

      // means a deliverer has already taken the order
      if (ordersData.deliverer_id) {
        const { error: removePendingError } = await supabaseClient.rpc(
          'remove_pending_order',
          { order_id: id, user_id: user.id },
        )
        if (removePendingError) {
          setAlert({
            type: 'warning',
            message:
              removePendingError.code + ': ' + removePendingError.message,
            displayNow: false,
          })
        } else {
          setAlert({
            type: 'info',
            message: 'Order has been taken',
            displayNow: false,
          })
        }
        router.push('/deliverer/home')
        return
      }

      console.log(ordersData)

      setOrder({ ...ordersData, ordered_at: new Date(ordersData.ordered_at) })
    }

    query()

    // orderId is gotten from url, router and setAlert won't change -> ok to put in dependency array
  }, [id, orderId, router, setAlert, user.id])

  async function handleReject() {
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
      setAlert({ type: 'warning', message: error, displayNow: false })
    } else {
      setAlert({ type: 'info', message: 'Rejected order', displayNow: false })
    }
    router.push('/deliverer/home')
  }

  async function handleAccept() {
    const { data: updatedOrdersData, error: updatedOrdersError } =
      await supabaseClient
        .from('orders')
        .update({ id: id, deliverer_id: user.id, accepted_at: new Date() })
        .eq('id', id)
        .is('is_active', true)
        .is('deliverer_id', null)

    // remove order from pending_orders array in users table
    const { error: removePendingError } = await supabaseClient.rpc(
      'remove_pending_order',
      { order_id: id, user_id: user.id },
    )

    if (updatedOrdersError || removePendingError) {
      console.log(updatedOrdersError, removePendingError)

      // check if error is caused by order being taken, or something else
      const { data: ordersData, error: ordersError } = await supabaseClient
        .from('orders')
        .select('deliverer_id')
        .eq('id', orderId)
        .is('deliverer_id', null)

      if (ordersError) {
        setAlert({
          type: 'warning',
          message: ordersError.code + ': ' + ordersError.message,
          displayNow: false,
        })
        router.push('/deliverer/home')
        console.log(ordersError)
      }

      if (ordersData.length == 0) {
        setAlert({
          type: 'info',
          message: 'Order has been taken',
          displayNow: false,
        })
        router.push('/deliverer/home')
      }
    } else {
      setAlert({
        type: 'success',
        message: 'Accepted order',
        displayNow: false,
      })
      router.push('/deliverer/home')
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
                <p>{new Date(order.ordered_at).toDateString()}</p>
              </div>
              <div className="leading-relaxed">
                <p>{order.restaurant.name}</p>
                <p>{order.destination.name}</p>
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
