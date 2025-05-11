import { SpaceshipRepository } from '../interfaces/ISpaceshipRepository'
import { Spaceship, SpaceshipInfoResponse } from '../interfaces/ISpaceship'
import { DeliveryService } from './deliveryService'

class SpaceshipService {
  constructor(
    private spaceshipRepo: SpaceshipRepository,
    private deliveryService: DeliveryService
  ) {}

  getSpaceshipById = async (id: string): Promise<Spaceship | null> => {
    const spaceship = await this.spaceshipRepo.getById(id)
    if (!spaceship) {
      throw new Error('Spaceship not found!')
    }
    return spaceship
  }

  getEfficiencyScore = async (spaceshipId: string): Promise<number> => {
    const spaceship = await this.spaceshipRepo.getById(spaceshipId)
    const activeDelivery = await this.deliveryService.getActiveDelivery(
      spaceshipId
    )
    if (spaceship && activeDelivery) {
      return activeDelivery.cargoWeight / spaceship.maxCargo
    }
    return 0
  }

  getSpaceshipInfo = async (
    spaceshipId: string
  ): Promise<SpaceshipInfoResponse> => {
    const spaceship = await this.getSpaceshipById(spaceshipId)
    if (!spaceship) {
      throw new Error('Spaceship not found!')
    }
    const activeDelivery = await this.deliveryService.getActiveDelivery(
      spaceshipId
    )
    const efficiencyScore = await this.getEfficiencyScore(spaceshipId)

    return {
      id: spaceship.id,
      name: spaceship.name,
      maxCargo: spaceship.maxCargo,
      activeDeliveries: activeDelivery,
      efficiencyScore: efficiencyScore,
      warnings: efficiencyScore > 0.9 ? ['Overload risk'] : [],
    }
  }
}

export { SpaceshipService }
