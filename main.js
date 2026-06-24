// 1. CAPTURA DE ELEMENTOS DEL DOM (HTML)
// Traemos el formulario y los inputs para escuchar sus eventos y leer sus valores
const form = document.getElementById("formLogin");
const correo = document.getElementById("correo");
const password = document.getElementById("password");

// Traemos las etiquetas DIV vacías donde pondremos los textos de alerta en pantalla
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");

// 2. EXPRESIONES REGULARES (REGEX)
// regexCorreoUTP: Evalúa que empiece con 'U' o 'u', seguido de exactamente 8 números, y termine obligatoriamente en @utp.edu.pe
const regexCorreoUTP = /^[Uu][0-9]{8}@utp\.edu\.pe$/;

// regexPassword: Valida que la contraseña contenga única y estrictamente 6 dígitos numéricos (formato PIN)
const regexPassword = /^[0-9]{6}$/;

// 3. FUNCIÓN PARA LIMPIAR ERRORES ANTERIORES
// Borra los mensajes de error en pantalla para que no se acumulen en cada intento de envío
const LimpiarErrores = () => {
    errorCorreo.textContent = "";
    errorPassword.textContent = "";
};

// 4. ESCUCHADOR DE EVENTO 'SUBMIT' (AL PRESIONAR EL BOTÓN 'ENTRAR')
form.addEventListener("submit", (e) => {
    // Evitamos que la página se recargue automáticamente (comportamiento por defecto del submit)
    e.preventDefault();
    
    // Limpiamos la pantalla de textos de advertencia previos antes de volver a validar
    LimpiarErrores();

    // Variable bandera: asumimos que todo está bien hasta que se demuestre lo contrario
    let formularioValido = true;

    // --- VALIDACIÓN DEL CORREO ---
    if (correo.value.trim() === "") {
        errorCorreo.textContent = "El campo no puede estar vacío.";
        formularioValido = false; // Detiene el flujo exitoso
    } else if (!regexCorreoUTP.test(correo.value.trim())) {
        errorCorreo.textContent = "Formato inválido. Debe ser tu código UTP (Ej: U21234567@utp.edu.pe).";
        formularioValido = false;
    }

    // --- VALIDACIÓN DE LA CONTRASEÑA ---
    if (password.value.trim() === "") {
        errorPassword.textContent = "El PIN no puede estar vacío.";
        formularioValido = false;
    } else if (!regexPassword.test(password.value.trim())) {
        errorPassword.textContent = "El PIN debe tener exactamente 6 números.";
        formularioValido = false;
    }

    // --- ACCIÓN SI TODO ES CORRECTO ---
    // --- ACCIÓN SI TODO ES CORRECTO ---
    if (formularioValido) {
        // Estructuramos la información del usuario en un objeto
        const usuario = { correo: correo.value.trim() };
        
        // Obtenemos la lista actual de LocalStorage, si está vacía inicializamos un arreglo []
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        
        // Agregamos el nuevo usuario al arreglo y lo volvemos a guardar convertido en texto JSON
        usuarios.push(usuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        
        // 🚀 ¡AQUÍ LO PEGAS! 
        // Esta línea detiene todo y manda al estudiante directamente al nuevo Dashboard de citas
        window.location.href = "index.html"; 

        // NOTA: Como la página va a cambiar de inmediato a index.html, 
        // las líneas de abajo (el toast y el botón disabled) ya no serán necesarias en la pantalla de login.
    }
});

// 5. CONSUMO DE API ASÍNCRONA (FETCH API)
// Apuntamos al contenedor principal donde inyectaremos las tarjetas de los usuarios externos
const contenedor = document.getElementById("contenedor");

async function cargarUsuarios() {
    try {
        // Hacemos la petición HTTP externa de forma asíncrona (esperamos la respuesta)
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        // Si el servidor de la API responde con un estado de error (ej. 404 o 500) disparamos una excepción
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        // Transformamos los datos binarios recibidos en un archivo/objeto JS legible (JSON)
        const usuarios = await response.json();
        
        // Enviamos el arreglo de usuarios procesado a la función encargada de dibujarlos en pantalla
        renderizarUsuarios(usuarios);
    } catch (error) {
        // Bloque de contingencia si el internet falla o la API se cae
        console.error("Detalle del Error: ", error);
        contenedor.innerHTML = `<div class="col-12 text-center"><p class="text-danger">⚠️ No se pudieron cargar los datos de la API.</p></div>`;
    }
}

// 6. FUNCIÓN DE RENDERIZADO (DIBUJAR TARJETAS EN HTML)
function renderizarUsuarios(users) {
    // Vaciamos el contenedor por si había información previa cargada
    contenedor.innerHTML = ""; 
    
    // Recorremos cada usuario individual del arreglo proveído por la API
    users.forEach(user => {
        // Creamos la estructura HTML de la tarjeta (Card) usando plantillas de texto de JS (Template Literals)
        const card = `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
                <div class="card-header bg-primary text-white font-weight-bold">
                    ID Usuario: ${user.id}
                </div>
                <div class="card-body">
                    <h5 class="card-title text-dark">${user.name}</h5>
                    <ul class="list-unstyled small text-secondary">
                        <li><strong>Email:</strong> ${user.email}</li>
                        <li><strong>Web:</strong> ${user.website}</li>
                        <li><strong>Teléfono:</strong> ${user.phone}</li>
                    </ul>
                </div>
            </div>
        </div>
        `;
        // Acumulamos de forma consecutiva cada tarjeta creada dentro del contenedor HTML real
        contenedor.innerHTML += card;
    });
}