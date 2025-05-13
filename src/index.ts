import express, { Request, Response } from 'express'
import spaceshipRoutes from './routes/spaceship'
import deliveryRoutes from './routes/deliveries'

import { loadDataToMaps } from './services/dataStore'

const app = express()
app.use(express.json())

app.use('/spaceships', spaceshipRoutes)
app.use('/deliveries', deliveryRoutes)

app.listen(5000, async () => {
  console.log('Server running at http://localhost:5000')
  await loadDataToMaps()
})
