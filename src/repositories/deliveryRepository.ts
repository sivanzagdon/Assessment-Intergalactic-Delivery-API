import { DeliveryRepository } from '../interfaces/IDeliveryRepository'
import { deliveriesMap } from '../services/dataStoreService'
import { Delivery } from '../interfaces/IDelivery'
import { savingDeliveryInCSV } from '../helpers/writers/writeDeliveryInCSV'

class InMemoryDeliveryRepository implements DeliveryRepository {
  getSize(): number {
    let size = 0
    deliveriesMap.forEach((deliveriesList) => {
      size += deliveriesList.length
    })
    return size
  }

  async getBySpaceshipId(spaceshipId: string): Promise<Delivery[]> {
    return deliveriesMap.get(spaceshipId) || []
  }

  async getAll(): Promise<Delivery[]> {
    let allDeliveries: Delivery[] = []
    deliveriesMap.forEach((deliveryList) => {
      allDeliveries = allDeliveries.concat(deliveryList)
    })
    return allDeliveries
  }

  async getActiveDelivery(spaceshipId: string): Promise<Delivery | null> {
    const activeDelivery =
      deliveriesMap
        .get(spaceshipId)
        ?.find((delivery) => delivery.status === 'ACTIVE') || null
    return activeDelivery
  }

  async save(delivery: Delivery): Promise<void> {
    if (!deliveriesMap.has(delivery.spaceshipId)) {
      deliveriesMap.set(delivery.spaceshipId, [])
    }
    deliveriesMap.get(delivery.spaceshipId)?.push(delivery)
    await savingDeliveryInCSV(delivery)
  }
}

export { InMemoryDeliveryRepository }
