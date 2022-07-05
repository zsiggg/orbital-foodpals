import { Alert } from 'components/Alert'
import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { OrderDto, RestaurantDto } from 'types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useAlert } from 'contexts/AlertContext'

const Restaurant = ({ user }) => {
  const [alert, setAlert] = useAlert()
  const router = useRouter()
  const { id } = router.query
  const restaurantId = Number(id)

  const [imgSrc, setImgSrc] = useState<string>()
  const [restaurant, setRestaurant] = useState<RestaurantDto>()
  const [orderText, setOrderText] = useState<string>()
  const [orderId, setOrderId] = useState<number>()

  useEffect(() => {
    const loadRestaurant = async () => {
      const { data, error } = await supabaseClient
        .from<RestaurantDto>('restaurants')
        .select('*')
        .eq('id', restaurantId)
      if (error) {
        console.log(error)
      }
      setRestaurant(data[0])
    }

    const loadRestaurantPic = async () => {
      const { data, error } = await supabaseClient.storage
        .from('restaurant-photos')
        .download(restaurantId + '/profile.jpg')
      if (error) {
        console.log(error)
      } else {
        setImgSrc(URL.createObjectURL(data))
      }
    }

    loadRestaurant()
    loadRestaurantPic()
  }, [restaurantId])

  function handleSubmit(e) {
    console.log(user.id)
    e.preventDefault()
    if (!orderText || !orderText.trim()) {
      setAlert({ type: 'info', message: 'Enter your order', displayNow: true })
      return
    }
    setOrderText(orderText.trim())

    const getDestinationId = async () => {
      const { data, error } = await supabaseClient
        .from('users')
        .select('default_destination')
        .eq('id', user.id)
        .limit(1)
        .single()
      if (error) {
        console.log(error)
        throw error
      } else {
        console.log(data)
        return data.default_destination
      }
    }

    const addOrder = async (destinationId: number) => {
      const { data, error } = await supabaseClient
        .from<OrderDto>('orders')
        .insert({
          restaurant_id: restaurant.id,
          order_text: orderText,
          buyer_id: user.id,
          ordered_at: new Date(),
          is_active: true,
          destination_id: destinationId,
        })
        .limit(1)
        .single()
      if (error) {
        console.log(error)
        throw error
      } else {
        console.log(data)
        return data.id
      }
    }

    // add to all user's pending order arrays (temporary)
    // should be adding according to how close the user is to the restaurant
    const addToPendingOrders = async (orderId: number) => {
      const { data, error } = await supabaseClient.rpc(
        'add_pending_order_to_all',
        { order_id: orderId },
      )
      if (error) {
        console.log(error)
        throw error
      } else {
        console.log(data)
        router.push('/buyer/home')
        setAlert({ type: 'success', message: 'Order added', displayNow: false })
      }
    }

    getDestinationId()
      .then(addOrder)
      .then(addToPendingOrders)
      .catch((err) => console.log(err))
  }

  if (restaurant) {
    return (
      <>
        <div className="container mx-auto p-4 flex flex-col space-y-8">
          <Alert />
          <div className="h-[30vh] w-full relative flex flex-col justify-center items-center">
            {imgSrc ? (
              <Image
                src={imgSrc}
                layout="fill"
                objectFit="contain"
                alt="Restaurant Pic"
              />
            ) : (
              <p className="text-center">Loading...</p>
            )}
          </div>

          <div>
            <div className="text-xl font-bold">{restaurant.name}</div>
            <div className="">{restaurant.location}</div>
          </div>

          <a
            className="flex p-5 rounded-lg mt-4 justify-between items-center w-full shadow-sm bg-white border border-gray-300 font-medium"
            href={restaurant.menu_link}
            target="_blank"
            rel="noreferrer"
          >
            <span>Menu</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </a>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="pl-2 text-xl font-medium">Your Order</div>
            <textarea
              className="w-full resize-none p-5"
              rows={10}
              onChange={(e) => setOrderText(e.target.value)}
              placeholder={
                'Be as detailed as possible!\ne.g. 1x 6pc Chicken McNuggets ala carte, curry sauce'
              }
            />
            <input
              type="submit"
              className="p-5 w-full rounded-xl shadow-sm bg-gray-200 hover:bg-gray-300 hover:border hover:border-gray-400 text-lg font-medium"
              value="Submit Order"
            />
          </form>
        </div>
      </>
    )
  } else {
    return <p>Loading...</p>
  }
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' })
export default Restaurant
