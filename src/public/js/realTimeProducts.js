const socket = io()

const form = document.getElementById('formProduct')


form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //El formulario que disparo el evento
    const prod = Object.fromEntries(datForm) //Dado un objeto iterable, te devuelvo sus datos en un objeto simple
    socket.emit('nuevoProducto', prod)
    socket.on('mensajeProductoCreado', (mensaje) => {

        Swal.fire(
            mensaje
        )
    })
    e.target.reset()
})

const arrayProductos = document.getElementById('productos')


socket.on('lista', listado => {
    arrayProductos.innerHTML = "" //Limpio el html
    listado.forEach(producto => {
        arrayProductos.innerHTML += 
        `<h3>Nombre: ${producto.title}</h3> 
        <h3> Descripcion: ${producto.description}</h3>   
        <h3> Categoria: ${producto.category}</h3> 
        <h3>Precio: ${producto.price}</h3>
        <h3>Stock: ${producto.stock}</h3>
        <h3>Codigo: ${producto.code}</h3>  
        <h3>Status: ${producto.status}</h3>
        <hr>`
    })
})