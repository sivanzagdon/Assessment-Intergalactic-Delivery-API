import { DeliveryRepository } from '../interfaces/IDeliveryRepository'
import {
  Delivery,
  Destination,
  NewDeliveryRequest,
} from '../interfaces/IDelivery'

import { SpaceshipRepository } from '../interfaces/ISpaceshipRepository'
import { DestinationRepository } from '../interfaces/IDestinationRepository'

class DeliveryService {
  constructor(
    private deliveryRepo: DeliveryRepository,
    private spaceshipRepo: SpaceshipRepository,
    private destinationRepo: DestinationRepository
  ) {}

  getDeliveriesBySpaceshipId = async (
    spaceshipId: string
  ): Promise<Delivery[]> => {
    return await this.deliveryRepo.getBySpaceshipId(spaceshipId)
  }

  getDeliveries = async (
    sortBy: string = 'weight',
    desc: string = 'false'
  ): Promise<Delivery[]> => {
    const deliveries = await this.deliveryRepo.getAll()

    if (sortBy === 'weight') {
      deliveries.sort((a, b) => a.cargoWeight - b.cargoWeight)
    } else if (sortBy === 'destination') {
      deliveries.sort((a, b) => a.destination.localeCompare(b.destination))
    }

    if (desc == 'true') {
      deliveries.reverse()
    }

    return deliveries
  }

  getActiveDelivery = async (spaceshipId: string): Promise<Delivery | null> => {
    return await this.deliveryRepo.getActiveDelivery(spaceshipId)
  }

  isValidDestination = async (destinationName: string): Promise<Boolean> => {
    return (await this.destinationRepo.getAll()).some(
      (d) => d.name === destinationName
    )
  }

  validateCargoForSpaceship = async (
    cargoWeight: number,
    maxCargo: number
  ): Promise<void> => {
    if (cargoWeight < 100 || cargoWeight > 50000 || cargoWeight > maxCargo) {
      throw new Error('Invalid cargo weight')
    }
  }

  createNewDelivery = async (
    request: NewDeliveryRequest
  ): Promise<Delivery> => {
    const spaceship = await this.spaceshipRepo.getById(request.spaceshipId)
    if (!spaceship) {
      throw new Error('Invalid spaceship ID')
    }

    await this.validateCargoForSpaceship(
      request.cargoWeight,
      spaceship.maxCargo
    )

    const activeDelivery = await this.getActiveDelivery(request.spaceshipId)
    if (activeDelivery) {
      throw new Error('There is already an active delivery for this spaceship')
    }

    if (!this.isValidDestination(request.destination)) {
      throw new Error('Invalid destination')
    }

    const newDelivery: Delivery = {
      id: `del-${this.deliveryRepo.getSize() + 1}`,
      spaceshipId: request.spaceshipId,
      destination: request.destination,
      cargoWeight: request.cargoWeight,
      status: 'ACTIVE',
    }

    await this.deliveryRepo.save(newDelivery)
    return newDelivery
  }
}

export { DeliveryService }
