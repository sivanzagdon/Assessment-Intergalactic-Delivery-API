import { loadCSV } from '../helpers/CSVLoader'
import { Delivery } from '../interfaces/IDelivery'
import { Destination } from '../interfaces/IDestination'
import { Spaceship } from '../interfaces/ISpaceship'

export let spaceshipsMap: Map<string, Spaceship> = new Map()
export let deliveriesMap: Map<string, Delivery[]> = new Map()
export let destinationsMap: Map<string, Destination> = new Map()

export const loadDataToMaps = async () => {
  try {
    const spaceships = await loadCSV('spaceships.csv')
    const deliveries = await loadCSV('deliveries.csv')
    const destinations = await loadCSV('destinations.csv')

    spaceships.forEach((spaceship: Spaceship) => {
      spaceshipsMap.set(spaceship.id, spaceship)
    })

    deliveries.forEach((delivery: Delivery) => {
      if (!deliveriesMap.has(delivery.spaceshipId)) {
        deliveriesMap.set(delivery.spaceshipId, [])
      }
      deliveriesMap.get(delivery.spaceshipId)?.push(delivery)
    })

    destinations.forEach((destination: Destination) => {
      destinationsMap.set(destination.name, destination)
    })

    console.log('Data loaded successfully..')
  } catch (err) {
    console.error('Error loading data:', err)
  }
}
