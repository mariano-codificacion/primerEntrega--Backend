
const botonLogout = document.getElementById('botonLogout')

botonLogout.addEventListener('click', () => {
    window.location.href = "/api/sessions/logout"    
})
