const express = require('express')
const cors = require("cors");

const userModel = require('../models/User')
const userRouter = express.Router()
const crypto = require('crypto');
const { commonFunction } = require('../commonFunction');

userRouter.use(cors())

userRouter.get('/', cors(), (req, res, next) => {
    const listUser = userModel.find({})
    res.send(listUser)
})

userRouter.post('/register', cors(), async (req, res) => {
    try {
        const salt = crypto.randomBytes(16).toString('hex')
        let user = req.body
        const hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64, `sha512`).toString(`hex`)
        user.password = hash
        user.salt = salt
        await userModel.create(user)
        res.send(commonFunction.responseSuccess('người dùng', 'Đăng ký', 'vi'))
    } catch (error) {
        res.status(400).json({ error })
    }
})

userRouter.post('/login', cors(), async (req, res) => {
    try {
        const user = await userModel.findOne({ userName: req.body.userName })
        if (user) {
            let hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, `sha512`).toString(`hex`)
            if (user.password == hash) {
                res.send(
                    {
                        data: user,
                        message: 'Đăng nhập thành công'
                    }
                )
            } else {
                res.send({ message: 'Mật khẩu không đúng, vui lòng kiểm tra lại!' })
            }
        } else {
            res.send({ message: 'Tài khoản không tồn tại, vui lòng kiểm tra lại!' })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
})

userRouter.post('/change-password/:id', cors(), async (req, res) => {
    const id = new ObjectId(req.params['id'])
    const filter = { _id: id }

    // cho password mới nha
    const salt = crypto.randomBytes(16).toString('hex')
    const passHash = crypto.pbkdf2Sync(req.body.newPassword, salt, 1000, 64, `sha512`).toString(`hex`)

    try {
        const user = await userModel.findOne(filter)
        if (user) {
            let hash = crypto.pbkdf2Sync(req.body.password, user.salt, 1000, 64, `sha512`).toString(`hex`)
            if (user.password == hash) {
                userModel.updateOne(filter, {
                    password: passHash,
                    salt: salt
                })
                res.send({ message: 'đã đổi mật khẩu thành công' })

            } else {
                res.send({ message: 'Mật khẩu hiện tại không đúng, vui lòng kiểm tra lại!' })
            }
        } else {
            res.send({ message: 'Tài khoản không tồn tại, vui lòng kiểm tra lại!' })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
})

module.exports = userRouter