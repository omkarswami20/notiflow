

const registerSchema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'password'],

        properties: {
            name: { type: 'string', minLength: 2, maxLength: 20, },
            email: {type:'string',format:'email'},
            password: { type: 'string', minLength:9, maxLength:16}

        }
    }
} 

const loginSchema = {
    body:{
        type:'object',
        required:['email', 'password'],
        properties:{
            email:{type:'string', format:'email'},
            password:{type:'string', minLength:9, maxLength:16}
        }
    }
}


const changePasswordSchema = {
  body: {
    type: 'object',
    required: ['oldPassword', 'newPassword'],
    properties: {
      oldPassword: { type: 'string' },
      newPassword: { type: 'string', minLength: 6 }
    }
  }
}

const refreshSchema = {
  body: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' }
    }
  }
}

module.exports = { registerSchema, loginSchema, changePasswordSchema, refreshSchema }