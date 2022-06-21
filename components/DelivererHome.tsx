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

      console.log(pendingOrders)

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
