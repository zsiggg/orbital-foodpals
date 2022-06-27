import React from 'react'
import { OrderDto } from 'types'

export const OrderCardBuyer = ({ order }: { order: OrderDto }) => {
  return (
    <div className="w-full border rounded-md border-inherit p-4">
      <div className="flex">
        <div className="flex-1">
          <div className="text-md font-bold">{order.restaurant_id.name}</div>
          <div className="mt-1 mb-3 whitespace-pre-line">
            {order.order_text}
          </div>
          <div>
            {new Date(order.ordered_at).toLocaleString([], {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        <button
          type="button"
          className="ml-5 my-auto bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => alert('Opens a current order page')}
        >
          View
        </button>
      </div>
    </div>
  )
}
