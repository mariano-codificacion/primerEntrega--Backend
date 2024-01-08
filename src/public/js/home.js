
const botonLogout = document.getElementById('botonLogout')

botonLogout.addEventListener('click', () => {
    window.location.href = "/api/session/logout"    
})
