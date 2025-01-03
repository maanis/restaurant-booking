const jwt = require('jsonwebtoken')

const tokenGenerator = (data)=>{
    return jwt.sign({username:data.username}, process.env.JWT_SECRET)
}

module.exports = tokenGenerator