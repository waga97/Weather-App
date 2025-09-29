export interface WeatherInfo {
  weatherDescription: string
  weatherIcon: string
  bgClass: string
}

export const weatherCodes: Record<number, WeatherInfo> = {
  0: {
    weatherDescription: 'Clear sky',
    weatherIcon: '☀️',
    bgClass: 'bg-gradient-to-t from-sky-400 to-blue-600',
  },
  1: {
    weatherDescription: 'Mainly clear',
    weatherIcon: '🌤️',
    bgClass: 'bg-gradient-to-t from-sky-300 to-blue-500',
  },
  2: {
    weatherDescription: 'Partly cloudy',
    weatherIcon: '⛅',
    bgClass: 'bg-gradient-to-t from-gray-300 to-gray-500',
  },
  3: {
    weatherDescription: 'Overcast',
    weatherIcon: '☁️',
    bgClass: 'bg-gradient-to-t from-gray-400 to-gray-700',
  },

  45: {
    weatherDescription: 'Fog',
    weatherIcon: '🌫️',
    bgClass: 'bg-gradient-to-t from-gray-300 to-gray-500',
  },
  48: {
    weatherDescription: 'Depositing rime fog',
    weatherIcon: '🌫️',
    bgClass: 'bg-gradient-to-t from-gray-300 to-gray-500',
  },

  51: {
    weatherDescription: 'Drizzle: Light intensity',
    weatherIcon: '🌦️',
    bgClass: 'bg-gradient-to-t from-blue-200 to-blue-400',
  },
  53: {
    weatherDescription: 'Drizzle: Moderate intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-blue-300 to-blue-600',
  },
  55: {
    weatherDescription: 'Drizzle: Dense intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-blue-400 to-blue-700',
  },

  56: {
    weatherDescription: 'Freezing drizzle: Light intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-indigo-200 to-indigo-400',
  },
  57: {
    weatherDescription: 'Freezing drizzle: Dense intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-indigo-300 to-indigo-600',
  },

  61: {
    weatherDescription: 'Rain: Slight intensity',
    weatherIcon: '🌦️',
    bgClass: 'bg-gradient-to-t from-blue-400 to-blue-700',
  },
  63: {
    weatherDescription: 'Rain: Moderate intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-blue-500 to-blue-800',
  },
  65: {
    weatherDescription: 'Rain: Heavy intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-blue-600 to-indigo-900',
  },

  66: {
    weatherDescription: 'Freezing rain: Light intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-indigo-300 to-indigo-500',
  },
  67: {
    weatherDescription: 'Freezing rain: Heavy intensity',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-indigo-500 to-indigo-800',
  },

  71: {
    weatherDescription: 'Snowfall: Slight intensity',
    weatherIcon: '🌨️',
    bgClass: 'bg-gradient-to-t from-indigo-200 to-indigo-400',
  },
  73: {
    weatherDescription: 'Snowfall: Moderate intensity',
    weatherIcon: '🌨️',
    bgClass: 'bg-gradient-to-t from-indigo-300 to-indigo-500',
  },
  75: {
    weatherDescription: 'Snowfall: Heavy intensity',
    weatherIcon: '❄️',
    bgClass: 'bg-gradient-to-t from-indigo-400 to-indigo-700',
  },
  77: {
    weatherDescription: 'Snow grains',
    weatherIcon: '❄️',
    bgClass: 'bg-gradient-to-t from-indigo-200 to-indigo-500',
  },

  80: {
    weatherDescription: 'Rain showers: Slight',
    weatherIcon: '🌦️',
    bgClass: 'bg-gradient-to-t from-blue-400 to-blue-700',
  },
  81: {
    weatherDescription: 'Rain showers: Moderate',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-blue-500 to-indigo-800',
  },
  82: {
    weatherDescription: 'Rain showers: Violent',
    weatherIcon: '🌧️',
    bgClass: 'bg-gradient-to-t from-indigo-600 to-indigo-900',
  },

  85: {
    weatherDescription: 'Snow showers: Slight',
    weatherIcon: '🌨️',
    bgClass: 'bg-gradient-to-t from-indigo-200 to-indigo-400',
  },
  86: {
    weatherDescription: 'Snow showers: Heavy',
    weatherIcon: '❄️',
    bgClass: 'bg-gradient-to-t from-indigo-400 to-indigo-700',
  },

  95: {
    weatherDescription: 'Thunderstorm: Slight or moderate',
    weatherIcon: '⛈️',
    bgClass: 'bg-gradient-to-t from-purple-600 to-purple-900',
  },
  96: {
    weatherDescription: 'Thunderstorm with slight hail',
    weatherIcon: '⛈️',
    bgClass: 'bg-gradient-to-t from-purple-700 to-black',
  },
  99: {
    weatherDescription: 'Thunderstorm with heavy hail',
    weatherIcon: '⛈️',
    bgClass: 'bg-gradient-to-t from-purple-900 to-black',
  },
}
