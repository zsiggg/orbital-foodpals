import { DestinationDto } from "./DestinationDto"
import { IncomingOrderDto } from "./OrderDto"

export type UserDto = {
    id?: string
    name: string
    email: string
    default_destination_id: number
    default_destination: DestinationDto
    phone: string
  
    created_at: Date
    updated_at?: Date
    deleted_at?: Date
  
    preferences?: JSON
    coordinates?: string

    pending_orders_id: number[]
    pending_orders: IncomingOrderDto[]

    is_deliverer: boolean
  }