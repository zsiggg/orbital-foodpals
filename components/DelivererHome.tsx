import { useState, useEffect } from 'react'
import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'
import { OrderCard } from './OrderCard'
import Head from 'next/head'

import React from 'react'
import { useUser } from '@supabase/auth-helpers-react'

export const DelivererHome = () => {
  const [orders, setOrders] = useState([])
  const { user, error } = useUser()

  useEffect(() => {
    const loadOrders = async () => {
      // const { data, error } = await supabase.from('orders').select('*')

      // select from pending orders array in users; bc of RLS, user will only select own roww
      const { data: orderIds, error: orderIdsError } = await supabaseClient
        .from('users')
        .select('pending_orders')

      if (orderIds.length > 0) {
        console.log(orderIds)
        const { data, error } = await supabaseClient
          .from('orders')
          .select('*')
          .in('id', orderIds[0].pending_orders)
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
        <div className="text-xl font-bold">Deliverer Home</div>
        <div>Current Location: 18 Clementi Rd, Singapore 129747</div>
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
