import express from 'express'
import multer from 'multer'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import productRouter from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import { __dirname } from './path.js'
import path from 'path'
import { ProductManager } from './controllers/productManager.js'
import mongoose from 'mongoose'
import messageModel from './models/messages.models.js'

const PORT = 4000
const app = express()


mongoose.connect('mongodb+srv://mariano140278:coderhouse@cluster0.n5dxhff.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("DB conectada"))
    .catch((error) => console.log("Error en conexion a MongoDB Atlas: ", error))


const productManager = new ProductManager('./src/products.json')
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

/*
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")
    /*
        socket.on('mensaje', info => {
            console.log(info)
            socket.emit('respuesta', false)
        })
    
        socket.on('juego', (infoJuego) => {
            if (infoJuego == "poker")
                console.log("Conexion a Poker")
            else
                console.log("Conexion a Truco")
        })
    */
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")
    socket.on('nuevoProducto', async (prod) => {
        console.log(prod)
        //Deberia agregarse al txt o json mediante addProduct
        await productManager.addProduct(prod)
        socket.emit("mensajeProductoCreado", "El producto se creo correctamente")
      
    })
})

io.on("connection", async (socket) => {
    console.log("Conexion con Socket.io")
    const listas = await productManager.getProducts()
    socket.emit('lista', listas)
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

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //URL extensas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

//Routes
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +
app.use('/api/products', productRouter)
app.use('/api/carts', routerCarts)
console.log(path.join(__dirname, '/public'))

//HBS
app.get('/static/realtimeproducts', (req, res) => {

    /*   const user = {
            nombre: "mariano",
            cargo: "alumno"
        }
    
        const cursos = [
            { numCurso: "123", dia: "LyM", horario: "Noche" },
            { numCurso: "456", dia: "MyJ", horario: "Tarde" },
            { numCurso: "789", dia: "S", horario: "Mañana" }
        ]
    */
    /*
        //Indicar que plantilla voy a utilizar
        
        res.render("users", {
            titulo: "Users",
            usuario: user,
            rutaCSS: "users.css",
            isTutor: user.cargo == "Tutor",
            cursos: cursos
        })
    */
    /*
       res.render ('chat', {
        rutaCSS: "style",
        rutaJS: "chat"
       })
    */

    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })
})


app.get('/static/home', async (req, res) => {

    const listaProds = await productManager.getProducts()

    res.render("home", {
        rutaCSS: "home",
        rutaJS: "home",
        listaProds: listaProds
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

