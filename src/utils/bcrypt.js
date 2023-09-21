import bcrypt from 'bcrypt'

//encriptar
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(process.env.SALT)))

const hashPassword = createHash("coderhouse")

//validar
export const validatePassword = (passwordSend, passwordBDD) => bcrypt.compareSync(passwordSend, passwordBDD) 