import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { supabase } from '../../../api'
import { useRouter } from 'next/router'
import { useAlert } from '../../../helpers/alertContext'
import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'

type ApiIncomingOrder = {
    id: number
    restaurant_id: number
    order_text: string
    deliverer_id: string
    ordered_at: Date
    is_active: boolean
    destination_id: number
    cost: number
}

type ApiRestaurantName = {
    id: number
    name: string
}

type ApiDestinationName = {
    id: number
    name: string
}

type incomingOrder = {
    id: number
    restaurant: string
    order: string
    deliveryLocation: string  // stored as point in db; convert to address on frontend?
    amount: number
    orderedAt: Date
}


const IncomingOrder = ({ user }) => {
    const router = useRouter()
    const [alert, setAlert] = useAlert()

    // will be passed in from the homescreen, when the user selects the incoming order
    const { id } = router.query
    const orderId: Number = Number(id)

    const [order, setOrder]: [incomingOrder, Dispatch<SetStateAction<incomingOrder>>] = useState()

    // simulate api call, pass in props.id
    useEffect(() => {
        if (orderId) {      // bc somehow on the first render orderId = NaN
            (async () => {
                const { data: ordersData, error: ordersError } = await supabaseClient
                    .from<ApiIncomingOrder>('orders')
                    .select('id, restaurant_id, order_text, deliverer_id, ordered_at, is_active, destination_id, cost')
                    .filter('id', 'eq', orderId)
                    .filter('deliverer_id', 'is', 'NULL')
                if (ordersError) {
                    router.push('/home')
                    setAlert({ type: 'warning', message: ordersError.code + ': ' + ordersError.message })
                    console.log(ordersError)
                    return
                }
                
                if (ordersData.length == 0) {
                    router.push('/home')
                    setAlert({ type: 'info', message: 'Order has been taken'})
                    return
                }
    
                const { data: restaurantsData, error: restaurantsError } = await supabaseClient
                    .from<ApiRestaurantName>('restaurants')
                    .select('id, name')
                    .filter('id', 'eq', ordersData[0].restaurant_id)
                if (restaurantsError) {
                    router.push('/home')
                    setAlert({ type: 'warning', message: restaurantsError.code + ': ' + restaurantsError.message })
                    console.log(restaurantsError)
                    return
                }
                
                const { data: destinationsData, error: destinationsError } = await supabaseClient
                    .from<ApiDestinationName>('destinations')
                    .select('id, name')
                    .filter('id', 'eq', ordersData[0].destination_id)
                if (destinationsError) {
                    router.push('/home')
                    setAlert({ type: 'warning', message: destinationsError.code + ': ' + destinationsError.message })
                    console.log(destinationsError)
                    return
                }
                
                setOrder({
                    id: ordersData[0].id,
                    restaurant: restaurantsData[0].name,
                    order: ordersData[0].order_text,
                    deliveryLocation: destinationsData[0].name,
                    amount: ordersData[0].cost,
                    orderedAt: new Date(ordersData[0].ordered_at)
                })
            })()
        }
    }, [orderId])

    async function handleReject() {
        console.log('store in db rejected, never show this order on the homescreen again')
        let error = ""
        const { error: removePendingError } = await supabaseClient.rpc('remove_pending_order', { order_id: id, user_id: user.id })
        if (removePendingError) { 
            error += removePendingError.code + ': ' + removePendingError.message + '\n'
        }
        const { error: addRejectedError } = await supabaseClient.rpc('add_rejected_user', { order_id: id, user_id: user.id })
        if (addRejectedError) {
            error += addRejectedError.code + ': ' + addRejectedError.message
        }
        
        if (error) {
            setAlert({ type: 'warning', message: error })
        } else {
            setAlert({ type: 'info', message: 'Rejected order' })
        }
        router.push('/home')
    }

    async function handleAccept() {
       // implement auth to get the user uid
        const { data: updatedOrdersData, error: updatedOrdersError } = await supabaseClient
            .from('orders')
            .update({ id: id, deliverer_id: user.id })
            .eq('id', id)
            .is('is_active', true)
            .is('deliverer_id', null)

        // possible that order has been taken or completed
        if (updatedOrdersError) {
            const { data: ordersData, error: ordersError } = await supabaseClient
                .from<ApiIncomingOrder>('orders')
                .select('id, restaurant_id, order_text, deliverer_id, ordered_at, is_active, destination_id, cost')
                .filter('id', 'eq', orderId)
                .filter('deliverer_id', 'is', 'NULL')
            if (ordersError) {
                router.push('/home')
                setAlert({ type: 'warning', message: ordersError.code + ': ' + ordersError.message })
                console.log(ordersError)
            }
            
            if (ordersData.length == 0) {
                router.push('/home')
                setAlert({ type: 'info', message: 'Order has been taken'})
            }
        } else {
            router.push('/home')
            setAlert({type: 'success', message: 'Accepted order' })
        }

        // remove order from pending_orders array in users table
        const { error } = await supabaseClient.rpc('remove_pending_order', { order_id: id, user_id: user.id })
        if (error) { 
            console.log(error) 
        }
    }
        
    
    return (
        <>
        <section className="flex flex-col h-screen justify-center sm:h-auto sm:justify-start items-center space-y-5 sm:mt-8">
            <section className="border border-gray-300 p-5 rounded-md max-w-xs sm:max-w-md">
                {!order && <p>Loading...</p>}

                {order && (<div className="flex flex-col space-y-3">
                    <div className="font-bold text-xl">Order #{order.id} ({order.orderedAt.toLocaleTimeString(undefined,{hour:'numeric' ,minute:'2-digit', hour12: true})})</div>
                        <div className="leading-relaxed">
                            <p>{order.restaurant}</p>
                            <p>{order.deliveryLocation}</p>
                            <p>{order.amount}</p>
                        </div>
                        <div className="leading-snug break-words">
                            <p>{order.order}</p>
                        </div>
                    </div>)
                }   
            </section>

            <section className="flex space-x-16">
                <button className="py-2 px-3 bg-red-600 text-sm text-white font-medium rounded-lg border hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in duration-100" onClick={handleReject}>
                Reject
                </button>
                <button className="py-2 px-3 bg-green-600 text-sm text-white font-medium rounded-lg border hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in duration-100" onClick={handleAccept}>
                Accept
                </button>
            </section>
        </section>
        </>
    )
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
export default IncomingOrder