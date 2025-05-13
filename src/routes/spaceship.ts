import { Router, Request, Response } from 'express'
import { SpaceshipService } from '../services/spaceshipService'
import { InMemorySpaceshipRepository } from '../repositories/spaceshipRepository'
import { InMemoryDeliveryRepository } from '../repositories/deliveryRepository'
import { DeliveryService } from '../services/deliveryService'
import { InMemoryDestinatiomRepository } from '../repositories/destinationRepository'

const router = Router()
const spaceshipService = new SpaceshipService(
  new InMemorySpaceshipRepository(),
  new DeliveryService(
    new InMemoryDeliveryRepository(),
    new InMemorySpaceshipRepository(),
    new InMemoryDestinatiomRepository()
  )
)

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const spaceshipInfo = await spaceshipService.getSpaceshipInfo(req.params.id)
    res.status(200).json(spaceshipInfo)
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Spaceship not found!') {
        res.status(404).json({ message: error.message })
      } else {
        res.status(500).json({
          message: 'Error fetching spaceship information:',
          error: error.message,
        })
      }
    } else {
      res.status(500).json({ message: 'Unknown error occurred' })
    }
  }
})

export default router
