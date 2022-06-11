import { useState, useEffect } from 'react'
import { supabase } from '../api'
import { OrderCard } from './OrderCard'
import Head from 'next/head'

import React from 'react'

export const DelivererHome = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*')
      setOrders(data)
    }
    loadOrders()
  }, [])

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
