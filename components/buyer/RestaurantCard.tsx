import { useRouter } from 'next/router'
import React from 'react'
import { RestaurantDto } from 'types'

export const RestaurantCard = ({ restaurant }: { restaurant: RestaurantDto }) => {
  const router = useRouter()
  return (
    <div className="w-full border rounded-md border-inherit p-4">
      <div className="flex">
        <div className="flex-1">
          <div className="text-md font-bold">{restaurant.name}</div>
          <div className="flex space-x-3">
            <span>5 km</span>
            <span>&#8226;</span>
            <span>5 deliverers</span>
          </div>
        </div>


        <button
          type="button"
          className="ml-5 my-auto bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => router.push(`/buyer/restaurants/${restaurant.id}`)}
        >
          View
        </button>
      </div>
    </div>
  )
}
