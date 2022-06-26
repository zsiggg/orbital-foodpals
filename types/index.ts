export type IncomingOrderDto = {
  id: number
  restaurants: RestaurantIdNameDto
  order_text: string
  deliverer_id: string
  ordered_at: Date
  is_active: boolean
  destinations: DestinationDto
  cost: number
}

type RestaurantIdNameDto = {
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

export type RestaurantDto = {
  id: number
  name: string
  menu_link: string
  location_coordinates: [number, number]
  location: string
}

export type NewOrderDto = {
  id: number
  restaurant_id: number
  order_text: string
  buyer_id: string
  ordered_at: Date
  is_active: boolean
  destination_id: number
}

export type CurrentOrderDto = {
  id: number
  restaurants: RestaurantIdNameDto
  order_text: string
  buyer_id: string
  ordered_at: string
  is_active: boolean
}
