import express from 'express'
import configViewEngine from './configs/viewEngine'
import initWebRoute from './router/web'
import initAPIRoute from './router/api'

require('dotenv').config()

var morgan = require('morgan')

const app = express()
const port = process.env.PORT

// my middleware
app.use((req, res, next) => {
    //check
    next()
})

app.use(morgan('combined'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// setup view engine
configViewEngine(app)

// init web route
initWebRoute(app)

initAPIRoute(app)

// 404
app.use((req, res) => res.render('404.ejs'))

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
