const form = document.getElementById("formLogin")
const correo = document.getElementById("correo")
const password = document.getElementById("password")

const errorCorreo = document.getElementById("errorCorreo")
const errorPassword = document.getElementById("errorPassword")

const regexCorreoUTP=/^[Uu][0-9]{8}@(utp.edu.pe)$/;
const regexPassword=/^[0-9]{6}$/;

//borra mensajes antiguos//
const LimpiarErrores = ()=>{
    errorCorreo.textContent="";
    errorPassword.textContent="";
}

form.addEventListener("submit" , (e)=>{
    e.preventDefault();
    LimpiarErrores();

    let formularioValido=true;

    //validar correo utp // //trim si esta vacio error//
    if(correo.value.trim()===""){
        errorCorreo.textContent="El campo no puede estar vacio";
        formularioValido=false;
    }else if(!regexCorreoUTP.test(correo.value)){
        errorCorreo.textContent="El Correo ingresado no es valido ";
        formularioValido=false;
    }

    //validar pin 
    if(password.value.trim()===""){
        errorPassword.textContent="El campo del PIN no es valido";
        formularioValido=false;
    }else if(!regexPassword.test(password.value)){
        errorPassword.textContent="El pin ingresado no es valido ";
        formularioValido=false;
    }
    // local storage//
    if(formularioValido){
        const usuario={
            correo:correo.value.trim()
        };
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios.push(usuario);
        localStorage.setItem("usuarios",JSON.stringify(usuarios));
        form.reset();
        //activar boton diabled//
        document.getElementById("btnCargar").disabled = false;
        alert("Acceso correcto,ahora puedes cargar usuarios");
    }



    //para que funcione el modal de bost//
    if (formularioValido) {
    const toast = new bootstrap.Toast(document.getElementById("toastRegistro"));
    toast.show();

    
}
});

//consumo de api asincronico //

const contenedor =document.getElementById("contenedor");
async function cargarUsuarios() {
    
    try{
        //traer datos
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if(!response.ok){
            throw new Error("Error en la respuesta API");
        }
        const usuarios = await response.json();

        renderizarUsuarios(usuarios);
        
        



    } catch(error){
        console.error("Error ", error);
        contenedor.innerHTML= `<p class="text-danger"><Error al cargar usuarios </p>`;
    
    }
    
}

function renderizarUsuarios(users){
    contenedor.innerHTML="";
    users.forEach(user =>{
        const card = `
        <div class="col-md-6 col-lg-4">
        <div class="card text-center h-100 shadow">
            <div class="card-header">
            Featured
            </div>
            <div class="card-body">
            <h5 class="card-title">${user.name}</h5>
            <ul class="list-unstyled">
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Web:</strong> ${user.website}</li>
                <li><strong>Teléfono:</strong> ${user.phone}</li>
            </ul>
            <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
            <div class="card-footer text-body-secondary">
            2 days ago
            </div>
        </div>
        </div>
        `;
        contenedor.innerHTML += card;
    });
}

