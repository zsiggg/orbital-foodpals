import { DestinationDto } from "./DestinationDto"
import { RestaurantDto } from "./RestaurantDto"
import { UserDto } from "./UserDto"

export type OrderDto = {
    id: number
    restaurant_id: number
    restaurant: RestaurantDto

    order_text: string

    buyer_id: string
    buyer: UserDto

    deliverer_id: string
    deliverer: UserDto
  
    ordered_at: Date
    delivered_at: Date
    accepted_at: Date
    cancelled_at: Date

    is_active: boolean
    
    destination_id: number
    destination: DestinationDto

    cost: number
    
    rejected_users_id: number[]
    rejected_users: UserDto[]
}

export type IncomingOrderDto = {
    id: number
    restaurant_id: number 
    restaurant: RestaurantDto

    order_text: string

    deliverer_id: string
    deliverer: UserDto

    ordered_at: Date
    is_active: boolean

    destination_id: number
    destination: DestinationDto
    
    cost: number
}