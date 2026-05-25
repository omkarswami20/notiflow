const getNotificationsSchema = {

    querystring: {
        type: 'object',
        properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 }
        }
    }
}


const broadcastSchema = {
    body: {
        type: 'object',
        required: ['title', 'message'],
        properties: {
            title: { type: 'string', minLength: 1 },
            message: { type: 'string', minLength: 1 }
        }   
    }
}


module.exports = { getNotificationsSchema, broadcastSchema }