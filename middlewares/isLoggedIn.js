const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
module.exports.isLoggedIn = async (req,res,next)=>{
    if(req.cookies.token){
        console.log(req.cookies)
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        let user = await userModel.findOne({username: decoded.username}).select(-decoded.password)
        req.user = user
        next()
    }else{
        console.log('no cookie')
        req.flash('error', 'Please Login first')
        res.redirect('register')
    }
}