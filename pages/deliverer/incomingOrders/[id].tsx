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


const incomingOrder = ({ user }) => {
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
                    router.push('/welcome')
                    setAlert({ type: 'warning', message: ordersError.code + ': ' + ordersError.message })
                    console.log(ordersError)
                    return
                }
                
                if (ordersData.length == 0) {
                    router.push('/welcome')
                    setAlert({ type: 'info', message: 'Order has been taken'})
                    return
                }
    
                const { data: restaurantsData, error: restaurantsError } = await supabaseClient
                    .from<ApiRestaurantName>('restaurants')
                    .select('id, name')
                    .filter('id', 'eq', ordersData[0].restaurant_id)
                if (restaurantsError) {
                    router.push('/welcome')
                    setAlert({ type: 'warning', message: restaurantsError.code + ': ' + restaurantsError.message })
                    console.log(restaurantsError)
                    return
                }
                
                const { data: destinationsData, error: destinationsError } = await supabaseClient
                    .from<ApiDestinationName>('destinations')
                    .select('id, name')
                    .filter('id', 'eq', ordersData[0].destination_id)
                if (destinationsError) {
                    router.push('/welcome')
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
        router.push('/welcome')
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
                router.push('/welcome')
                setAlert({ type: 'warning', message: ordersError.code + ': ' + ordersError.message })
                console.log(ordersError)
            }
            
            if (ordersData.length == 0) {
                router.push('/welcome')
                setAlert({ type: 'info', message: 'Order has been taken'})
            }
        } else {
            router.push('/welcome')
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
        <section className="flex flex-col justify-center items-center">
        <section>
            {!order && <p>Loading...</p>}

            {order && (<>
                <p>Order info</p>
                <p>{order.id}</p>
                <p>{order.restaurant}</p>
                <p>{order.order}</p>
                <p>{order.deliveryLocation}</p>
                <p>{order.amount}</p>
                <p>{order.orderedAt.toLocaleTimeString(undefined,{hour:'numeric' ,minute:'2-digit', hour12: true})}</p></>)
            }   
            

        </section>

        <section>
            <button className="border border-teal-300 mr-2" onClick={handleReject}>Reject</button>
            <button className="border border-teal-300 ml-2" onClick={handleAccept}>Accept</button>
        </section>
        </section>
        </>
    )
}

export const getServerSideProps = withPageAuth({ redirectTo: '/home' })
export default incomingOrder