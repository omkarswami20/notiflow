const { verifyAccessToken } = require('../utils/jwt.utils')
const { sendError } = require('../utils/response.utils')

const authenticate = async (request, reply) => {
    try {

        // get the token from the header
        const authHeader = request.headers['authorization']

        if (!authHeader || !authHeader.startsWith('Bearer ')) {

            return sendError(reply, 401, 'Acces token is missing or Invalid')
        }

        // extract the token 
        const token = authHeader.split(' ')[1]
        // verify the token
        const decoded = await verifyAccessToken(token)


        // attach the user to request 

        request.user = decoded

    } catch (error) {
        return sendError(reply, 'Invalid or expired token', 401)

    }
}



module.exports = {
    authenticate
}