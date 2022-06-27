import { useRouter } from 'next/router'
import React from 'react'
import { OrderDto } from 'types'

export const AcceptedOrderCard = ({ order }: { order: OrderDto }) => {
  const router = useRouter()
  return (
    <div className="w-full border rounded-md border-inherit p-4">
      <div className="flex">
        <div className="flex-1">
          <div className="pb-2">
            <div className="text-md font-bold">ID: {order.id}</div>
            <div>{order.order_text}</div>
            <div>Ordered By: {order.buyer_id.name}</div>
          </div>

          <div>Restaurant: {order.restaurant_id.name}</div>
          <div>Destination: {order.destination_id.name}</div>
          {/* will need to reformat with dayjs */}
          <div>Accepted at: {order.accepted_at.toLocaleString()}</div>
        </div>

        <button
          type="button"
          className="ml-5 my-auto bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => router.push(`/deliverer/current-order/${order.id}`)}
        >
          View
        </button>
      </div>
    </div>
  )
}
