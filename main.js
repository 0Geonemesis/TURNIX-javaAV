// main.js - Lógica para iniciar sesión
const formLogin = document.getElementById("formLogin");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");

if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const correo = correoInput.value.trim();
        const password = passwordInput.value.trim();

        // Limpiamos errores visuales previos
        document.getElementById("errorCorreo").textContent = "";
        document.getElementById("errorPassword").textContent = "";

        if (correo === "") {
            document.getElementById("errorCorreo").textContent = "Ingresa tu correo.";
            return;
        }

        if (password === "") {
            document.getElementById("errorPassword").textContent = "Ingresa tu contraseña.";
            return;
        }

        // Buscar usuarios en la "base de datos" del navegador
        let usuarios = JSON.parse(localStorage.getItem("turnix_usuarios")) || [];

        // Verificar credenciales
        const usuarioValido = usuarios.find(user => user.correo === correo && user.password === password);

        if (usuarioValido) {
            // Guardamos quién inició sesión para mostrar su nombre en el Dashboard
            localStorage.setItem("usuario_activo", JSON.stringify(usuarioValido));
            
            // Redirección directa al Dashboard
            window.location.href = "index.html";
        } else {
            // Si los datos son incorrectos
            document.getElementById("errorPassword").textContent = "Correo o contraseña incorrectos.";
        }
    });
}