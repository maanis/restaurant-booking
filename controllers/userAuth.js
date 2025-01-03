const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const tokenGenerator = require('../utils/jwtGenerator')


module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        let user = await userModel.findOne({ username })
        if (user) {
            req.flash('error', 'you already have an account, please login.')
            res.redirect('/register')
        }else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    let data = await userModel.create({
                        username,
                        password: hash,
                        email
                    })
                    const token = tokenGenerator(data)
                    res.cookie('token', token)
                    res.redirect('/')
                })
            })
        }
    } catch (error) {
        req.flash('error', error)
        res.redirect('/register')
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        let user = await userModel.findOne({ username })
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = tokenGenerator(user)
                    res.cookie('token', token)
                    res.redirect('/')
                } else {
                    req.flash('error', 'username or password incorrect')
                    res.redirect('/register')
                }
            })
        }
        else {
            req.flash('error', 'you dont have an account, create it first')
            res.redirect('/register')
        }
    } catch (error) {
        req.flash('error', error)
        res.redirect('/register')
    }
}

module.exports.logout = (req, res, next) => {
    res.cookie('token', '')
    res.redirect('/')
}