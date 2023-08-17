import express from 'express'
import multer from 'multer'
import {engine} from 'express-handlebars'
import {Server} from 'socket.io'
import routerProds from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import { __dirname } from './path.js'
import path from 'path'
const PORT = 4000
const app = express()

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})

const io = new Server(server)

//Conexion de Socket.io
io.on("connection", (socket) => {
    console.log("Conexion con Socket.io")

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

    socket.on('nuevoProducto', (prod) => {
        console.log(prod)
        //Deberia agregarse al txt o json mediante addProduct

        socket.emit("mensajeProductoCreado", "El producto se creo correctamente")
    })
})

//Config

const storage =multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req,file,cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
        //agrego un numero aleatorio delante para que no se repita
    }
})

const upload = multer ({storage: storage})

//Middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //URL extensas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
})

//Routes
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +
app.use('/api/products', routerProds)
app.use('/api/carts', routerCarts)
console.log(path.join(__dirname, '/public'))
//HBS
app.get('/static', (req, res) => {
    const user = {
        nombre: "mariano",
        cargo: "alumno"
    }

    const cursos = [
        { numCurso: "123", dia: "LyM", horario: "Noche" },
        { numCurso: "456", dia: "MyJ", horario: "Tarde" },
        { numCurso: "789", dia: "S", horario: "Mañana" }
    ]

    //Indicar que plantilla voy a utilizar
    /*
    res.render("users", {
        titulo: "Users",
        usuario: user,
        rutaCSS: "users.css",
        isTutor: user.cargo == "Tutor",
        cursos: cursos
    })
    */
    res.render("realTimeProducts", {
        rutaCSS: "realTimeProducts",
        rutaJS: "realTimeProducts"
    })

})