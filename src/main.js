import 'dotenv/config'
import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './path.js'
import path from 'path'
import mongoose from 'mongoose'
import productModel from './models/products.models.js';
import messageModel from './models/messages.models.js'
import cartModel from './models/carts.models.js'
import userModel from './models/users.models.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import initializePassport from './config/passport.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import router from './routes/index.routes.js'
import handlerErrors from './middlewares/errors/handlerErrors.js'
import { requestLogger } from './middlewares/loggers/requestLogger.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import { getCurrent } from './controllers/session.controller.js'

const PORT = 4000
const app = express()

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("DB conectada")
    })
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})


const swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Documentacion del curso de backend',
            description: 'API Coderhouse Backend'
        }
        },
        apis: [`${__dirname}/docs/**/*.yaml`]
    }

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const io = new Server(server)

const mensajes = []

//Conexion de Socket.io

io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('mensaje', async (info) => {
        console.log(info)
        mensajes.push(info)
        await messageModel.create(info)
        io.emit('mensajes', mensajes)
    })
})

app.use(express.json())
//Middlewares
app.use(cookieParser(process.env.JWT_SECRET)) //Firmo la cookie
app.use(session({ //Configuracion de la sesion de mi app
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 //Segundos, no en milisegundos
    }),
    //store: new fileStorage({ path: './sessions', ttl: 10000, retries: 1 }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//HBS
app.get('/static/realtimeproducts', (req, res) => {

    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })
    
})

app.get('/static/chat', (req, res) => {

    res.render("chat", {
        rutaCSS: "style",
        rutaJS: "chat"
    })
})

//SESSIONS

app.get('/static/register', async (req, res) => {

    res.render("register", {
        rutaCSS: "register",
    })
})

app.get('/static/login', async (req, res) => {

    res.render("login", {
        rutaCSS: "login",
        })
})


app.get('/static/products', (req, res) => {
	const user = req.query.info;
	console.log(user);
	res.render('products', {
		rutaCSS: 'products',
		rutaJS: 'products',
		user: user,
	});
});
//Routes

app.use(requestLogger)
app.use(express.urlencoded({ extended: true })) //URL extensas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//Routes
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +

console.log(path.join(__dirname, '/public'))

app.use('/', router)

