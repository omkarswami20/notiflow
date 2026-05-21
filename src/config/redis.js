const Redis = require('ioredis');

const redis = new Redis(
    process.env.REDIS_URL
)

redis.on('connect',() => {
    console.log ('Redis Connected Succssfulllyyyyy')
})


redis.on('error', (err) => {
    console.log('Redis Connection Error:', err);
})


module.exports = redis;