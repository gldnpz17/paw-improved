import Redis from 'ioredis'

class RedisCachingService {
  constructor(configuration) {
    this.redisClient = new Redis(configuration.redisConnection)
  }

  async cacheObject(key, object, timeToLive) {
    let result = await this.redisClient.set(key, JSON.stringify(object), 'px', timeToLive)

    if (result !== 'OK') {
      // TODO: Throw error.
    }
  }

  async fetchCachedObject(key) {
    let result = await this.redisClient.get(key)

    if (!result) {
      return null
    }

    return JSON.parse(result)
  }
}

export default RedisCachingService