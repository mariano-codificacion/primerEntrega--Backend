const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')

let correo

Swal.fire({
    title: 'Correo Electronico',
  
}).then(async resultado => {
    const { value: email } = await Swal.fire({
        title: 'Input email address',
        input: 'email',
        inputLabel: 'Your email address',
        inputPlaceholder: 'Enter your email address',
        allowOutsideClick: false
      })
      if (email) {
        Swal.fire(`Entered email: ${email}`)
      }
        correo = email
        console.log(correo)
})
/*
const { value: email } = await Swal.fire({
    title: 'Input email address',
    input: 'email',
    inputLabel: 'Your email address',
    inputPlaceholder: 'Enter your email address'
  })
  
  if (email) {
    Swal.fire(`Entered email: ${email}`)
  }
    correo = resultado.value
    console.log(correo)
  */

botonChat.addEventListener('click', () => {
    let fechaActual = new Date().toLocaleString()
    if (valInput.value.trim().length > 0) { //Evitar que me envien un mensaje vacio
        socket.emit('mensaje', { fecha: fechaActual, email: correo , mensaje: valInput.value })
        valInput.value = "" //Limpio el input
    }
})

socket.on('mensajes', arrayMensajes => {
    parrafosMensajes.innerHTML = "" //Limio el html
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p>${mensaje.fecha} : ${mensaje.email} escribio ${mensaje.mensaje}</p>`
    })
})
