const socket = io()

socket.emit('mensaje', "Hola servidor, buenas noches")

socket.on('respuesta', (info) => {
    if (info) {
        socket.emit('juego', 'poker')
    } else {
        console.log("Error en conexion")
    }

})