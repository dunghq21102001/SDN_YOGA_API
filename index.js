// khai báo mọi thứ ở dây nha
const express = require('express')
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors");
const connectDB = require('./database')

const app = express()

// kết nối db
connectDB()

app.use(morgan("combined"))
app.use(express.json({ limit: '10mb' }))// for parsing application/json
app.use(express.urlencoded({ extended: true, limit: '10mb' }))// for parsing application/x-www-form-urlencoded
app.use(cors())

// các biến tự định nghĩa cho môi trường
const port = 3001
const PREFIX_API_URL = '/api/v1'


const usersRoute = require('./router/User')
const contactRoute = require('./router/Contact')
const classRoute = require('./router/Class')
const productRoute = require('./router/Product')
const productCategoryRouter = require('./router/ProductCategory')
const classCategoryRouter = require('./router/classCategory')

app.use(`${PREFIX_API_URL}/users/`, usersRoute)
app.use(`${PREFIX_API_URL}/contacts/`, contactRoute)
app.use(`${PREFIX_API_URL}/classes/`, classRoute)
app.use(`${PREFIX_API_URL}/products/`, productRoute)
app.use(`${PREFIX_API_URL}/productCategories/`, productCategoryRouter)
app.use(`${PREFIX_API_URL}/classCategories/`, classCategoryRouter)

app.get('/', (req, res) => {
  res.send('server working 🔥🔥🔥')
})


app.listen(port, () => {
  console.log(`My Server listening on port ${port}`)
})