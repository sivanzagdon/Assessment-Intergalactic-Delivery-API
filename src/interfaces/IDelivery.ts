export enum Destination {
  Mars = 'Mars',
  Venus = 'Venus',
  Jupiter = 'Jupiter',
  Saturn = 'Saturn',
}

export interface Delivery {
  id: string
  spaceshipId: string
  destination: Destination
  cargoWeight: number
  status: 'DELIVERED' | 'ACTIVE'
}

export interface NewDeliveryRequest {
  spaceshipId: string
  destination: Destination
  cargoWeight: number
}
