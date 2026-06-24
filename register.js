// register.js - Lógica para guardar nuevos usuarios
const formRegistro = document.getElementById("registerForm");

if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Capturamos los valores de los inputs
        const inputs = formRegistro.querySelectorAll("input");
        const nombre = inputs[0].value.trim();
        const correo = inputs[1].value.trim();
        const password = inputs[2].value.trim();
        const confirmarPassword = inputs[3].value.trim();

        // Validaciones básicas
        if (nombre === "" || correo === "" || password === "") {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (password !== confirmarPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Recuperar usuarios existentes o crear arreglo nuevo
        let usuarios = JSON.parse(localStorage.getItem("turnix_usuarios")) || [];

        // Verificar si el correo ya está registrado
        const existe = usuarios.find(user => user.correo === correo);
        if (existe) {
            alert("Este correo ya está registrado.");
            return;
        }

        // Guardar el nuevo usuario
        const nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            password: password,
            rol: "Negocio" // Rol por defecto según tu documento
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("turnix_usuarios", JSON.stringify(usuarios));

        alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
        
        // Redirigir al Login
        window.location.href = "login.html";
    });
}