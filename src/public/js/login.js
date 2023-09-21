const signIn = document.getElementById("singInForm");
signIn.addEventListener("submit", (e)=>{
    e.preventDefault ();
    const formData = new FormData(e.target);
    const login = Object.fromEntries(formData);
    console.log("Datos enviados", login);
    fetch('/login',{
        method:"POST",
        body:formData
    })
    .then(res=>res.json())
    .then(data =>console.log("Los datos del usuario son:", data))
    Swal.fire(
        "Inicio de sesión correcto",
        "succes"
    )
    signIn.reset();
})