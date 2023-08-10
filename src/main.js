import express from 'express'
import multer from 'multer'
import routerProd from './routes/products.routes.js'
import { __dirname } from './path.js'
import path from 'path'
const PORT = 4000
const app = express()

//Config

const storage =multer.diskStorage({
    destiantion: (req, file, cb) => {
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

app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
})

//Routes
app.use('/static', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +
app.use('/api/product', routerProd)

console.log(path.join(__dirname, '/public'))

//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})