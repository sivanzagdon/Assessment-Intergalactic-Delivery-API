import { Delivery } from './IDelivery'

export interface DeliveryRepository {
  getBySpaceshipId(spaceshipId: string): Promise<Delivery[]>
  getActiveDelivery(spaceshipId: string): Promise<Delivery | null>
  getAll(): Promise<Delivery[]>
  save(delivery: Delivery): Promise<void>
}
