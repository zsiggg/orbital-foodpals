export type IncomingOrderDto = {
  id: number
  restaurants: RestaurantDto
  order_text: string
  deliverer_id: string
  ordered_at: Date
  is_active: boolean
  destinations: DestinationDto
  cost: number
}

type RestaurantDto = {
  id: number
  name: string
}

export type DestinationDto = {
  id: number
  name: string
  //NEED TO FIND THE RIGHT TYPE FOR COORDINATES
  coordinates: string
}

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
