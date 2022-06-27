import { useState, useEffect } from 'react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { RestaurantCard } from './RestaurantCard'
import Head from 'next/head'

import React from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { OrderDto, RestaurantDto } from 'types'
import { OrderCardBuyer } from './OrderCardBuyer'

export const BuyerHome = () => {
  const [restaurants, setRestaurants] = useState<RestaurantDto[]>([])
  const [currentOrders, setCurrentOrders] = useState<OrderDto[]>([])
  const { user, error } = useUser()

  useEffect(() => {
    const loadRestaurants = async () => {
      const { data, error } = await supabaseClient
        .from<RestaurantDto>('restaurants')
        .select('*')
      if (error) {
        console.log(error)
      } else {
        setRestaurants(data)
      }
    }

    const loadCurrentOrders = async (user) => {
      const { data, error } = await supabaseClient
        .from<OrderDto>('orders')
        .select(
          'id, restaurant_id (id, name), order_text, buyer_id, ordered_at, is_active',
        )
        .eq('buyer_id', user.id)
        .is('is_active', true)
      if (error) {
        console.log(error)
      } else {
        setCurrentOrders(data)
      }
    }

    if (user) {
      loadRestaurants()
      loadCurrentOrders(user)
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="container mx-auto p-4">
        <div className="text-xl font-bold">Buyer Home</div>
        <div>Current Location: 18 Clementi Rd, Singapore 129747</div>

        {currentOrders && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold pl-2">Current Orders</h2>
            <div className="mt-2">
              {currentOrders.map((order) => (
                <OrderCardBuyer order={order} key={order.id} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold pl-2">Restaurants</h2>
          <div className="mt-2">
            {restaurants.map((restaurant) => (
              <RestaurantCard restaurant={restaurant} key={restaurant.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
