import { useRouter } from 'next/router'
import React from 'react'
import { IncomingOrderDto, OrderDto } from 'types'

export const PendingOrderCard = ({ order }: { order: IncomingOrderDto }) => {
  const router = useRouter()
  return (
    <div className="w-full border rounded-md border-inherit p-4 mb-3">
      <div className="flex">
        <div className="flex-1">
          <div className="text-md font-bold">ID: {order.id}</div>
          <div>{order.order_text}</div>
          <div>{new Date(order.ordered_at).toDateString()}</div>
        </div>

        <button
          type="button"
          className="ml-5 my-auto bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => router.push(`/deliverer/incoming-order/${order.id}`)}
        >
          View
        </button>
      </div>
    </div>
  )
}
