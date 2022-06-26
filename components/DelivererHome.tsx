import { useState, useEffect } from 'react'
import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'
import { OrderCard } from './OrderCard'
import Head from 'next/head'

import React from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { IncomingOrderDto } from 'types'

export const DelivererHome = () => {
  const [orders, setOrders] = useState<IncomingOrderDto[]>([])
  const { user, error } = useUser()
  const [location, setLocation] = useState('')

  useEffect(() => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

    let longitude = 0.0
    let latitude = 0.0

    const getLocation = async () => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        longitude = pos.coords.longitude
        latitude = pos.coords.latitude

        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=poi&access_token=` +
            accessToken,
        )

        const data = await res.json()
        setLocation(data.features[0].place_name)
      })
    }
    getLocation()
  }, [])

  useEffect(() => {
    const loadOrders = async () => {
      // select from pending orders array in users; bc of RLS, user will only select own roww
      const {
        data: { pending_orders: pendingOrders },
        error,
      } = await supabaseClient
        .from('users')
        .select('pending_orders')
        .eq('id', user.id)
        .limit(1)
        .single()

      if (pendingOrders.length > 0) {
        const { data, error } = await supabaseClient
          .from<IncomingOrderDto>('orders')
          .select('*')
          .in('id', pendingOrders)
        setOrders(data)
      }
    }
    if (user) {
      loadOrders()
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="container mx-auto p-4">
        <div className="text-2xl font-bold">Deliverer Home</div>
        <div>Current Location: {location}</div>
        <div className="mt-4">
          <div>
            {orders.map((order) => (
              <OrderCard order={order} key={order.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
