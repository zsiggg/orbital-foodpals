import { DestinationDto } from "./DestinationDto"
import { RestaurantDto } from "./RestaurantDto"
import { UserDto } from "./UserDto"

export type OrderDto = {
    id: number
    restaurant_id: RestaurantDto
    order_text: string
    buyer_id: UserDto
    deliverer_id: string
  
    ordered_at: Date
    accepted_at: Date
    cancelled_at: Date
    is_active: boolean
    destination_id: DestinationDto
    cost: number
    rejected_users: number[]
}

export type IncomingOrderDto = {
    id: number
    restaurant_id: RestaurantDto
    order_text: string
    deliverer_id: string
    ordered_at: Date
    is_active: boolean
    destination_id: DestinationDto
    cost: number
}