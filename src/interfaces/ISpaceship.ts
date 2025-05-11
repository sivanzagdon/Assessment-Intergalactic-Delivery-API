import { Delivery } from './IDelivery'

export interface Spaceship {
  id: string
  name: string
  maxCargo: number
}

export interface SpaceshipInfoResponse {
  id: string
  name: string
  maxCargo: number
  activeDeliveries: Delivery | null
  efficiencyScore: number
  warnings?: string[]
}
