import nodemailer from 'nodemailer'
import logger from '../utils/logger.js'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'mariano140278@gmail.com',
        pass: process.env.EMAIL_PASS, 
        authMethod: 'LOGIN'
    }
})

//Funciones de nodemailer

export const sendRecoveryEmail = (email, recoveryLink) => {
    const mailOptions = {
        from: 'mariano140278@gmail.com',
        to: email,
        subject: 'Link de recuperacion de su contraseña',
        text: `Por favor haz click en el siguiente enlace ${recoveryLink}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log(error)
        else
            console.log('Email enviado correctamente')
    })
}

export const deletionEmail = (email) => {
    const mailOptions = {
        from: 'mariano140278@gmail.com',
        to: email,
        subject: 'Cuenta eliminada',
        html: `<p>Tu cuenta ha sido eliminada debido a inactividad.</p><br/>
               <p>Si deseas volver a utilizar nuestros servicios, por favor crea una nueva cuenta.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error('Error al enviar el correo \n' + error);
        } else {
            logger.info('Correo de eliminación de cuenta inactiva enviado a ' + email);
        }
    });
}