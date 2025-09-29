import { weatherCodes } from '@/configs/weather'

export function mapWeatherCode(code: number) {
  return (
    weatherCodes[code] ?? {
      weatherDescription: 'Unknown',
      weatherIcon: '❓',
      bgClass: 'bg-blue-white',
    }
  )
}
