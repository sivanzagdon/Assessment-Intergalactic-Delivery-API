import express, { Request, Response } from 'express'
import { DeliveryService } from '../services/deliveryService'
import { InMemoryDeliveryRepository } from '../repositories/deliveryRepository'
import { NewDeliveryRequest } from '../interfaces/IDelivery'
import { InMemorySpaceshipRepository } from '../repositories/spaceshipRepository'
import { InMemoryDestinatiomRepository } from '../repositories/destinationRepository'

const router = express.Router()
const deliveryService = new DeliveryService(
  new InMemoryDeliveryRepository(),
  new InMemorySpaceshipRepository(),
  new InMemoryDestinatiomRepository()
)

router.post('/', async (req: Request, res: Response) => {
  try {
    const deliveryRequest = req.body as NewDeliveryRequest
    const newDelivery = await deliveryService.createNewDelivery(deliveryRequest)
    res.status(201).json(newDelivery)
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message ===
        'There is already an active delivery for this spaceship'
      ) {
        res.status(409).json({
          message: error.message,
        })
      } else if (
        error.message === 'Invalid spaceship ID' ||
        'Invalid destination' ||
        'Invalid cargo weight'
      ) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json({
          message: 'Error create new delivery',
          error: error.message,
        })
      }
    } else {
      res.status(500).json({ message: 'Unknown error occurred!' })
    }
  }
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const { sortBy, desc } = req.query
    const deliveries = await deliveryService.getDeliveries(
      sortBy as string,
      desc as string
    )
    res.status(200).json(deliveries)
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: 'Error retrieving deliveries', error: error.message })
    } else {
      res.status(500).json({ message: 'Unknown error occurred!' })
    }
  }
})

export default router
