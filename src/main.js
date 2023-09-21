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
/*
function auth(req, res, next) {
    console.log(req.session.email)

    if (req.session.email == "admin@admin.com" && req.session.password == "1234") {
        return next() //Continua con la ejecucion normal de la ruta
    }

    return res.send("No tenes acceso a este contenido")
}
*/
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
        rutaJS: "register"
    })
    })
    
app.get('/static/login', async (req, res) => {

   
    
res.render("login", {
    rutaCSS: "login",
    rutaJS: "login"
})
})

/*
app.get('/admin', auth, (req, res) => {
    res.send("Sos admin")
})
*/
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error)
            console.log(error)
        else
            res.redirect('/')
    })
})


//res.redirect('/static/home?info=${user.first_name}') 

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

/*
//en la ruta home, accedo a ese dato por medio de const info=req.query.info; Luego la envio como lo hacia con products

Son 4 views de handlebars: products/home, sign in(registrarse), login y logout

Las view se crean como lo venimos haciendo, un pequeño formulario, para el caso de sign in con los campos que pide la ruta para crear el usuario. En el caso de la view login para lo que pide la ruta login.

La vista products ya la tenemos creada, es donde renderizamos los productos por handlebars.

Pueden tenerla como products o como home.

Ruta Post de User.routes conecta con el formulario de sign in mediante la etiqueta HTML action en el formulario.

Ruta Post de Sessions.routes conecta con el formulario de log in.

Redireccionamiento:

En la ruta post /login de sessions.routes,si el usuario se loguea correctamente, cambiar el res.send por res.redirect() para redirigir a la view products, Como lo explique por el chat de la tutoría.

La vista products debe recibir la información que mandamos en el redirect y mostrarla como mensaje de bienvenida.

La vista products también debe tener un botón de logout, que al hacer click redirija a /api/sessions/logout. Es puro JS ( en products.js, addEventListener al botón , y redirigir a la ruta logout de sessions.routes)

Finalmente la ruta get /logout de sessions.routes, después de terminar la sesión, debe redirigir a la vista /static/login.

*/
