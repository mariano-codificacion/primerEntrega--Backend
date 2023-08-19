const socket = io()

const arrayProductos = document.getElementById('productos')


socket.on('lista', listado => {
    arrayProductos.innerHTML = "" //Limpio el html
    listado.forEach(producto => {
        arrayProductos.innerHTML += `<p>Nombre: ${producto.title}\n , Descripcion: ${producto.description} , Categoria: ${producto.category}</p>`
    })
})