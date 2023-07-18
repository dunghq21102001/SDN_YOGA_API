const express = require('express')
const cors = require("cors")
const classModel = require('../models/Class')
const userModel = require('../models/User')
const userRouter = express.Router()
const crypto = require('crypto')
const { commonFunction } = require('../commonFunction')
const { ObjectId } = require('mongodb')
userRouter.use(cors())

userRouter.get('/', cors(), (req, res, next) => {
    const listUser = userModel.find({})
    res.send(listUser)
})

userRouter.post('/register', cors(), async (req, res) => {

    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const existingUser = await userModel.findOne({ userName: req.body.userName })

    if (existingUser) {
        return res.json({ error: 'User already exists' })
    }

    var crypto = require('crypto')
    salt = crypto.randomBytes(16).toString('hex')
    user = req.body
    hash = crypto.pbkdf2Sync(user.password, salt, 1000, 64, `sha512`).toString(`hex`)
    user.password = hash
    user.salt = salt
    await userModel.create(user)
    res.send(req.body)
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

userRouter.get('/users', cors(), async (req, res) => {
    const listUser = await userModel.find({})
    res.send(listUser)
})

userRouter.get('/user/:id', cors(), async (req, res) => {
    const id = new ObjectId(req.params['id'])
    res.send(await userModel.findOne({ _id: id }).populate('registeredCourses').populate('classesTaught'))
})

userRouter.put('/user/:id', cors(), async (req, res) => {
    const userId = req.params.id
    const updatedUserData = req.body

    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' })
        }

        user.fullName = updatedUserData.fullName
        user.email = updatedUserData.email
        user.userName = updatedUserData.userName
        user.role = updatedUserData.role
        user.phone = updatedUserData.phone
        user.address = updatedUserData.address

        await user.save()

        res.json({ message: 'Thông tin người dùng đã được cập nhật' })
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi' })
    }
})

userRouter.put('/updatePT/:ptIds', (req, res, next) => {
    var id = req.params.ptIds
    var newclassesTaught = req.body.classesTaught
    let arr = []
    arr.push(newclassesTaught)
    userModel.findByIdAndUpdate(id, {
        classesTaught: arr
    })
        .then(data => {
            res.json("Update successfully")
        })
        .catch(err => {
            res.status(500).json("Cannot update!!!")
        })
})

userRouter.put('/:id/image', async (req, res) => {
    try {
        const userId = req.params.id
        const { image } = req.body

        // Kiểm tra xem người dùng có tồn tại không
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' })
        }

        user.image = image
        await user.save()

        res.json({ user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật hình ảnh' })
    }
})


userRouter.delete('/user/:id', cors(), async (req, res) => {
    const id = new ObjectId(req.params['id'])
    await classModel.updateMany(
        { userIds: id },
        { $pull: { userIds: id } }
      );
      await classModel.updateMany(
        { ptIds: id },
        { $pull: { ptIds: id } }
      );
    const result = await userModel.deleteOne({ _id: id })
    if (result.deletedCount === 1) {
        res.send('ok')
    } else {
        // res.send(commonFunction.unknownError('vi'))
        res.status(500).json("Something went wrong!!!")
    }
})

userRouter.get('/search', cors(), async (req, res) => {
    const fullName = req.query.fullName

    try {
        const users = await userModel.find({ fullName: { $regex: fullName, $options: 'i' } })
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

userRouter.get('/ascending', async (req, res) => {
    try {
        const users = await userModel.find().sort({ fullName: 'asc' })
        res.json(users)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

userRouter.get('/descending', async (req, res) => {
    try {
        const users = await userModel.find().sort({ fullName: 'desc' })
        res.json(users)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = userRouter