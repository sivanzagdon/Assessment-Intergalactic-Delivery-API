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
    return spaceship
  }

  getEfficiencyScore = async (
    cargoWeight: number,
    maxCargo: number
  ): Promise<number> => {
    return cargoWeight / maxCargo
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
    const efficiencyScore = activeDelivery
      ? await this.getEfficiencyScore(
          activeDelivery?.cargoWeight,
          spaceship.maxCargo
        )
      : 0

    const spaceshipInfoResponse: SpaceshipInfoResponse = {
      id: spaceship.id,
      name: spaceship.name,
      maxCargo: spaceship.maxCargo,
      activeDeliveries: activeDelivery,
      efficiencyScore: efficiencyScore,
      warnings: efficiencyScore > 0.9 ? ['Overload risk'] : [],
    }
    return spaceshipInfoResponse
  }
}

export { SpaceshipService }
