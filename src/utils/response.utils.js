const sendSuccess = (reply, data, message = 'Success', statusCode = 200) => {
return reply.code(statusCode).send(
    {
        sucess:true,
        messaage,
        data
    })

}

const sendError = (reply,message = 'something went wrong', statusCode = 500) => {
    return reply.code(statusCode).send(
        {
            sucess:false,
            message,
            data:null
        }
    )
}

module.exports = {
    sendSucess,
    sendError
}

