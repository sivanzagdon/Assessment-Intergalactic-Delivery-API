import { Delivery } from '../../interfaces/IDelivery'
import fs from 'fs'
import path from 'path'

export const savingDeliveryInCSV = async (
  newDelivery: Delivery
): Promise<void> => {
  const filePath = path.join(__dirname, '../../../src/data/deliveries.csv')
  const deliveryLine = `${newDelivery.id},${newDelivery.spaceshipId},${newDelivery.destination},${newDelivery.cargoWeight},${newDelivery.status}\n`
  fs.appendFileSync(filePath, deliveryLine, 'utf8')
}
