import { DestinationDto } from "./DestinationDto"
import { IncomingOrderDto } from "./OrderDto"

export type UserDto = {
    id?: string
    name: string
    email: string
    default_destination: DestinationDto | number
    phone: string
  
    created_at: Date
    updated_at?: Date
    deleted_at?: Date
  
    preferences?: JSON
    coordinates?: string
    pending_orders: IncomingOrderDto[] | number[]
    is_deliverer: boolean
  }