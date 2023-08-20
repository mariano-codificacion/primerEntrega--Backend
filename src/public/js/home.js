const socket = io()

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