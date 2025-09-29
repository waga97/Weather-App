import { fetchWeatherApi } from 'openmeteo'
import { getCoordinates } from '@/helpers/capitals/index'
import { z } from 'zod'
import dayjs from 'dayjs'

// Zod schema for validated WeatherData
const WeatherApiSchema = z.object({
  city: z.string(),
  time: z.date(),
  temperature: z.number(),
  weather_code: z.number(),
})

export type WeatherData = z.infer<typeof WeatherApiSchema>

const url = 'https://api.open-meteo.com/v1/forecast'

function getFirstResponse(
  responses: unknown
): Awaited<ReturnType<typeof fetchWeatherApi>>[number] | null {
  return Array.isArray(responses) && responses.length > 0 ? responses[0] : null
}

// --- Current ---
export async function getWeatherCurrent(cities: string[]): Promise<WeatherData[]> {
  const results = await Promise.all(
    cities.map(async (city) => {
      const { latitude, longitude } = getCoordinates(city)

      const params = {
        latitude,
        longitude,
        current: ['temperature_2m', 'weather_code'],
      }

      const responses = await fetchWeatherApi(url, params)
      const response = getFirstResponse(responses)

      if (!response) {
        return WeatherApiSchema.parse({
          city,
          time: new Date(),
          temperature: NaN, // fallback instead of null
          weather_code: -1, // fallback instead of null
        })
      }

      const utcOffsetSeconds = response.utcOffsetSeconds()
      const current = response.current()

      return WeatherApiSchema.parse({
        city,
        time: current ? new Date((Number(current.time()) + utcOffsetSeconds) * 1000) : new Date(),
        temperature: current?.variables(0)?.value() ?? NaN,
        weather_code: current?.variables(1)?.value() ?? -1,
      })
    })
  )

  return results
}

// --- Hourly ---
export async function getWeatherHourly(city: string, nextHoursCount = 4): Promise<WeatherData[]> {
  if (nextHoursCount < 1 || nextHoursCount > 12) {
    throw new Error('nextHoursCount must be between 1 and 12')
  }

  const { latitude, longitude } = getCoordinates(city)

  const params = {
    latitude,
    longitude,
    hourly: ['weather_code', 'temperature_2m'],
    forecast_days: 2,
  }

  const responses = await fetchWeatherApi(url, params)
  const response = getFirstResponse(responses)

  if (!response) return []

  const utcOffsetSeconds = response.utcOffsetSeconds()
  const hourly = response.hourly()
  if (!hourly) return []

  const times = Array.from(
    { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
  )

  const weatherCodes = hourly.variables(0)?.valuesArray() ?? []
  const temps = hourly.variables(1)?.valuesArray() ?? []

  const allHours: WeatherData[] = times.map((t, idx) =>
    WeatherApiSchema.parse({
      time: t,
      city,
      weather_code: weatherCodes[idx] ?? -1,
      temperature: temps[idx] ?? NaN,
    })
  )

  const now = new Date()
  return allHours.filter((h) => h.time > now).slice(0, nextHoursCount)
}

// --- Daily ---
export async function getWeatherDaily(city: string): Promise<WeatherData[]> {
  const { latitude, longitude } = getCoordinates(city)

  const today = dayjs()
  const dayOfWeek = today.day() // 0 = Sunday, 6 = Saturday

  const past_days = dayOfWeek
  const forecast_days = 7 - dayOfWeek

  const params = {
    latitude,
    longitude,
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
    past_days,
    forecast_days,
  }

  const responses = await fetchWeatherApi(url, params)
  const response = getFirstResponse(responses)

  if (!response) return []

  const utcOffsetSeconds = response.utcOffsetSeconds()
  const daily = response.daily()
  if (!daily) return []

  const times = Array.from(
    { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
    (_, i) => dayjs.unix(Number(daily.time()) + i * daily.interval() + utcOffsetSeconds).toDate()
  )

  const weatherCodes = daily.variables(0)?.valuesArray() ?? []
  const tempsMax = daily.variables(1)?.valuesArray() ?? []
  const tempsMin = daily.variables(2)?.valuesArray() ?? []

  const allDays: WeatherData[] = times.map((t, idx) => {
    const max = tempsMax[idx]
    const min = tempsMin[idx]

    return WeatherApiSchema.parse({
      time: t,
      city,
      weather_code: weatherCodes[idx] ?? -1,
      temperature: typeof max === 'number' && typeof min === 'number' ? (max + min) / 2 : NaN, // ✅ never null
    })
  })

  // Clip to this week (Sun → Sat)
  const startOfWeek = today.startOf('week') // Sunday
  const endOfWeek = today.endOf('week') // Saturday

  return allDays.filter(
    (d) => dayjs(d.time).isAfter(startOfWeek) && dayjs(d.time).isBefore(endOfWeek)
  )
}
