import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import productRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import sessionRouter from './routes/sessions.routes.js'
import userRouter from './routes/users.routes.js'
import { __dirname } from './path.js'
import path from 'path'
//import { ProductManager } from './controllers/productManager.js'
import mongoose from 'mongoose'
import productModel from './models/products.models.js';
import messageModel from './models/messages.models.js'
import cartModel from './models/carts.models.js';
import { userModel } from './models/users.models.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import initializePassport from './config/passport.js'
import passport from 'passport'

const PORT = 4000
const app = express()

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("DB conectada")

        //const resultado = await cartModel.find({ _id: "6501068fa08134a96ad13506" })
        //"64f7be67ee3d47232d0cd8b5"
        //console.log(JSON.stringify(resultado))
        //const resultados = await productModel.paginate({ status: 'true' }, { limit: 5, page: 1, sort: {price: 'desc' }})
        //console.log(resultados)
    })
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))

//const productManager = new ProductManager('./src/products.json')
//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

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


io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('nuevoProducto', async (prod) => {
        console.log(prod)
        await productModel.create(prod)
        //Deberia agregarse al txt o json mediante addProduct
        //await productManager.addProduct(prod)
        socket.emit("mensajeProductoCreado", "El producto se creo correctamente")

    })
})

io.on("connection", async (socket) => {
    console.log("Conexion con Socket.io")
    const products = await productModel.find().lean();
    socket.emit('lista', products)
})

//Config

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
        //agrego un numero aleatorio delante para que no se repita
    }
})
const upload = multer({ storage: storage })

app.use(express.json())

//Middlewares
//app.use(cookieParser(process.env.SIGNED_COOKIE)) //Firmo la cookie
app.use(session({ //Configuracion de la sesion de mi app
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 3600 //Segundos, no en milisegundos
    }),
    //store: new fileStorage({ path: './sessions', ttl: 10000, retries: 1 }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())



app.use(express.urlencoded({ extended: true })) //URL extensas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//Routes
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/users', userRouter)
console.log(path.join(__dirname, '/public'))

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

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
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




app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error)
            console.log(error)
        else
            res.redirect('/static/login')
    })
})


app.get('/static/home', async (req, res) => {
    const products = await productModel.find().lean();
    const info = req.query.info;
    res.render("home", {
        rutaCSS: "home",
        rutaJS: "home",
        products: products,
        info: info,
    });

})
