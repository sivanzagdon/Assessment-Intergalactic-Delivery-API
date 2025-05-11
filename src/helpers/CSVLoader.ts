import fs from 'fs'
import path from 'path'
import csvParser from 'csv-parser'

export const loadCSV = async (filename: string): Promise<any[]> => {
  const results: any[] = []
  const filePath = path.join(__dirname, '../../src/data', filename)

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        if (!Object.values(data).some((value) => String(value).trim() !== ''))
          return

        const cleaned: any = {}

        Object.entries(data).forEach(([key, value]) => {
          const cleanKey = String(key).trim()
          cleaned[cleanKey] = String(value).trim()
        })

        switch (filename) {
          case 'spaceships.csv':
            cleaned.maxCargo = parseInt(cleaned.maxCargo)
            break
          case 'deliveries.csv':
            cleaned.cargoWeight = parseInt(cleaned.cargoWeight)
            break
          case 'destinations.csv':
            cleaned.distance = parseInt(cleaned.distance)
            cleaned.hasAtmosphere = cleaned.hasAtmosphere === 'true'
            cleaned.isHazardous = cleaned.isHazardous === 'true'
            break
        }

        results.push(cleaned)
      })
      .on('end', () => resolve(results))
      .on('error', reject)
  })
}
