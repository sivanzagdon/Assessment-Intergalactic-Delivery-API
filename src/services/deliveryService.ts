import { DeliveryRepository } from '../interfaces/IDeliveryRepository'
import {
  Delivery,
  Destination,
  NewDeliveryRequest,
} from '../interfaces/IDelivery'
import { deliveriesMap } from './dataStore'
import { SpaceshipRepository } from '../interfaces/ISpaceshipRepository'

class DeliveryService {
  constructor(
    private deliveryRepo: DeliveryRepository,
    private spaceshipRepo: SpaceshipRepository
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
    let deliveries: Delivery[] = []

    const allDeliveries = await this.deliveryRepo.getAll()
    allDeliveries.forEach((deliveryList) => {
      deliveries = deliveries.concat(deliveryList)
    })

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

  isValidDestination(destination: string): Boolean {
    return Object.values(Destination).includes(destination as Destination)
  }

  validateCargoForSpaceship = async (
    cargoWeight: number,
    spaceshipId: string
  ): Promise<void> => {
    const spaceship = await this.spaceshipRepo.getById(spaceshipId)
    if (!spaceship) {
      throw new Error('Invalid spaceship ID')
    }
    const maxCargo = spaceship.maxCargo
    if (cargoWeight < 100 || cargoWeight > 50000 || cargoWeight > maxCargo) {
      throw new Error('Invalid cargo weight')
    }
  }

  createNewDelivery = async (
    request: NewDeliveryRequest
  ): Promise<Delivery> => {
    const activeDelivery = await this.getActiveDelivery(request.spaceshipId)
    if (activeDelivery) {
      throw new Error('There is already an active delivery for this spaceship')
    }

    await this.validateCargoForSpaceship(
      request.cargoWeight,
      request.spaceshipId
    )

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
