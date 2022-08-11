import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { useAlert } from 'contexts/AlertContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { OrderDto } from 'types'

export const OrderOverlay = () => {
  const [order, setOrder] = useState<OrderDto>()
  const router = useRouter()
  const orderId: number = router.query.id as unknown as number

  const [alert, setAlert] = useAlert()
  const { id } = router.query

  useEffect(() => {
    const loadOrder = async () => {
      const { data: order, error } = await supabaseClient
        .from<OrderDto>('orders')
        .select(
          ' *, buyer:buyer_id(id, name), restaurant:restaurant_id(id, name), destination:destination_id(id, name)',
        )
        .eq('id', orderId)
        .single()

      setOrder(order)
    }

    loadOrder()
  }, [orderId])

  async function handleDelivered() {
    const { data: updatedOrdersData, error: updatedOrdersError } =
      await supabaseClient
        .from('orders')
        .update({ id: id, delivered_at: new Date(), is_active: false })
        .eq('id', id)
        .is('delivered_at', null)

    if (updatedOrdersError) {
      // check if error is caused by order being taken, or something else
      const { data: ordersData, error: ordersError } = await supabaseClient
        .from('orders')
        .select('delivered_at')
        .eq('id', orderId)

      if (ordersError) {
        setAlert({
          type: 'warning',
          message: ordersError.code + ': ' + ordersError.message,
          displayNow: false,
        })
        router.push('/deliverer/home')
        console.log(ordersError)
      }

      if (ordersData.length > 0) {
        setAlert({
          type: 'info',
          message: 'Order has been delivered',
          displayNow: false,
        })
        router.push('/deliverer/home')
      }
    } else {
      setAlert({
        type: 'success',
        message: 'Delivered order',
        displayNow: false,
      })
      router.push('/deliverer/home')
    }
  }

  return (
    <div>
      {order && (
        <div className="m-6">
          <div className="font-bold text-2xl">Order ID {order.id}</div>
          <div className="mt-6">
            <div className="font-semibold">Ordered by {order.buyer.name}</div>
            <div>{new Date(order.accepted_at).toDateString()}</div>
          </div>
          <div className="mt-6 text-white bg-green-600 w-max py-1 px-1.5 rounded-md">
            Time to deliver: 16 Minutes
          </div>
          <div className="mt-6">
            <div>Order:</div>
            <div>{order.order_text}</div>
          </div>
          <div className="mt-6">
            <div>Restaurant: {order.restaurant.name}</div>
            <div>Destination: {order.destination.name}</div>
          </div>

          <button
            onClick={handleDelivered}
            className="mt-60 float-right focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 lg:text-lg lg:font-bold rounded text-white px-4 sm:px-6 border border-indigo-700 py-2 sm:py-4 text-sm"
          >
            Mark Delivered
          </button>
        </div>
      )}
    </div>
  )
}
