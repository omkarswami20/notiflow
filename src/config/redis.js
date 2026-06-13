const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,          // don't hang forever on failures
  enableReadyCheck: true,
  keepAlive: 10000,                 // keep connection alive (Upstash drops idle)
  connectTimeout: 10000,
  retryStrategy: (times) => {
    if (times > 5) return null      // stop retrying after 5 attempts
    return Math.min(times * 500, 3000)
  },
  tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined
})

redis.on('connect', () => {
  console.log('Redis Connected Succssfulllyyyyy')
})

redis.on('error', (err) => {
  console.error('Redis Connection Error:', err.message)
})

module.exports = redis
