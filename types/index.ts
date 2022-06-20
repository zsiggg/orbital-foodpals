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

type DestinationDto = {
  id: number
  name: string
}
