import { useState, useEffect } from 'react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { PendingOrderCard } from './PendingOrderCard'
import Head from 'next/head'

import React from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { IncomingOrderDto, OrderDto, UserDto } from 'types'
import { AcceptedOrderCard } from './AcceptedOrderCard'
import { Slideover } from 'components/Slideover'

export const DelivererHome = () => {
  const [pendingOrders, setPendingOrders] = useState<IncomingOrderDto[]>([])
  const [acceptedOrders, setAcceptedOrders] = useState<OrderDto[]>([])
  const [userId, setUserId] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

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
    const loadUserInfo = async (user) => {
      const { data, error } = await supabaseClient
        .from<Partial<UserDto>>('users')
        .select('name')
        .eq('id', user.id)
        .limit(1)
        .single()
      if (error) {
        console.log(error)
      } else {
        setUserName(data.name)
      }
    }

    const loadOrders = async () => {
      // select from pending orders array in users; bc of RLS, user will only select own roww
      const {
        data: { pending_orders_id: pendingOrdersId },
        error,
      } = await supabaseClient
        .from<Partial<UserDto>>('users')
        .select('pending_orders_id')
        .eq('id', user.id)
        .limit(1)
        .single()

      if (pendingOrdersId?.length > 0) {
        const { data, error } = await supabaseClient
          .from<IncomingOrderDto>('orders')
          .select('*')
          .in('id', pendingOrdersId)
        setPendingOrders(data)
      }
    }

    const loadAcceptedOrders = async () => {
      const { data: acceptedOrders, error } = await supabaseClient
        .from<OrderDto>('orders')
        .select(
          ' *, buyer:buyer_id(id, name), restaurant:restaurant_id(id, name), destination:destination_id(id, name)',
        )
        .eq('deliverer_id', user.id)
      setAcceptedOrders(acceptedOrders)
    }
    if (user) {
      setUserId(user.id)
      loadUserInfo(user)
      loadOrders()
      loadAcceptedOrders()
    }
  }, [user])

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className="container mx-auto p-4">
        <div className='flex justify-between items-center'>
          <div>
            <div className="text-3xl font-bold">📦 Deliverer Home</div>
            <div>Current Location: {location}</div>
          </div>
          <Slideover showBuyerHome={true} userName={userName} userId={userId} />
        </div>

        <div className="my-8 shadow-sm rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold">Current Orders</div>
          <div className="py-2">
            {acceptedOrders?.length > 0 ? (
              <div>
                {acceptedOrders?.map((order) => (
                  <AcceptedOrderCard order={order} key={order.id} />
                ))}
              </div>
            ) : (
              <div>You have no accepted orders.</div>
            )}
          </div>
        </div>

        <div className="my-8 shadow-sm rounded-lg p-4 bg-white">
          <div className="text-lg font-semibold">Pending Orders</div>
          <div className="py-2">
            {pendingOrders?.length > 0 ? (
              <div>
                {pendingOrders?.map((order) => (
                  <PendingOrderCard order={order} key={order.id} />
                ))}
              </div>
            ) : (
              <div>You have no pending orders.</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
