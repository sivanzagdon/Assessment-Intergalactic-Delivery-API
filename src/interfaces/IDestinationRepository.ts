import { Destination } from './IDestination'

export interface DestinationRepository {
  getAll(): Promise<Destination[]>
}
