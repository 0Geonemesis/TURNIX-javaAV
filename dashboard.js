// 1. CAPTURA DE ELEMENTOS DE LA INTERFAZ (DOM)
const formCita = document.getElementById("formCita");
const paciente = document.getElementById("paciente");
const especialidad = document.getElementById("especialidad");
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");

// Elementos de la tabla y métricas
const tablaCitas = document.getElementById("tablaCitas");
const filaVacia = document.getElementById("filaVacia");
const metricaTotal = document.getElementById("metricaTotal");
const metricaPendientes = document.getElementById("metricaPendientes");

// 2. ARREGLO DE CITAS (Carga datos previos del LocalStorage si existen)
let listaCitas = JSON.parse(localStorage.getItem("citas_data")) || [];

// 3. FUNCIÓN PARA ACTUALIZAR LAS TARJETAS DE MÉTRICAS (KPIs)
const actualizarMetricas = () => {
    const total = listaCitas.length;
    metricaTotal.textContent = total;
    metricaPendientes.textContent = total; // En este ejemplo básico, todas las guardadas están pendientes
};

// 4. FUNCIÓN PARA PINTAR LAS CITAS EN LA TABLA
const renderizarCitas = () => {
    // Si no hay citas, mostramos el mensaje de "No hay citas agendadas"
    if (listaCitas.length === 0) {
        tablaCitas.innerHTML = `
            <tr id="filaVacia">
                <td colspan="5" class="text-center text-muted py-4">No hay citas agendadas actualmente.</td>
            </tr>`;
        return;
    }

    // Vaciamos la tabla para volver a llenarla sin duplicados
    tablaCitas.innerHTML = "";

    // Recorremos el arreglo estructurado
    listaCitas.forEach((cita, index) => {
        const fila = `
            <tr>
                <td><strong>${cita.paciente}</strong></td>
                <td><span class="badge bg-info text-dark">${cita.especialidad}</span></td>
                <td>${cita.fecha}</td>
                <td>${cita.hora} hs</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="eliminarCita(${index})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
        tablaCitas.innerHTML += fila;
    });
};

// 5. FUNCIÓN PARA ELIMINAR UNA CITA
window.eliminarCita = (index) => {
    // Eliminamos la cita seleccionada del arreglo usando su posición (index)
    listaCitas.splice(index, 1);
    
    // Guardamos los cambios actualizados en el LocalStorage
    localStorage.setItem("citas_data", JSON.stringify(listaCitas));
    
    // Volvemos a renderizar los cambios en la pantalla
    renderizarCitas();
    actualizarMetricas();
};

// 6. EVENTO AL ENVIAR EL FORMULARIO DE NUEVA CITA
formCita.addEventListener("submit", (e) => {
    e.preventDefault(); // Detiene la recarga de página

    // Reseteamos estilos de validación previos
    let formValido = true;

    // Validación básica: que los campos no estén vacíos
    if (paciente.value.trim() === "") {
        document.getElementById("errorPaciente").textContent = "Ingresa el nombre del paciente.";
        formValido = false;
    } else {
        document.getElementById("errorPaciente").textContent = "";
    }

    if (!especialidad.value) {
        document.getElementById("errorEspecialidad").textContent = "Selecciona una especialidad.";
        formValido = false;
    } else {
        document.getElementById("errorEspecialidad").textContent = "";
    }

    if (fecha.value === "") {
        document.getElementById("errorFecha").textContent = "Elige una fecha válida.";
        formValido = false;
    } else {
        document.getElementById("errorFecha").textContent = "";
    }

    if (hora.value === "") {
        document.getElementById("errorHora").textContent = "Elige una hora válida.";
        formValido = false;
    } else {
        document.getElementById("errorHora").textContent = "";
    }

    // Si pasamos las validaciones, creamos el objeto y guardamos
    if (formValido) {
        const nuevaCita = {
            paciente: paciente.value.trim(),
            especialidad: especialidad.value,
            fecha: fecha.value,
            hora: hora.value
        };

        // Empujamos el objeto al arreglo global
        listaCitas.push(nuevaCita);

        // Almacenamos permanentemente en LocalStorage
        localStorage.setItem("citas_data", JSON.stringify(listaCitas));

        // Actualizamos la vista de la aplicación
        renderizarCitas();
        actualizarMetricas();

        // Limpiamos los campos del formulario para la siguiente cita
        formCita.reset();
    }
});

// 7. INICIALIZACIÓN AUTOMÁTICA AL CARGAR LA PÁGINA
// Esto hace que si cierras el navegador y vuelves a entrar, tus citas sigan ahí dibujadas
renderizarCitas();
actualizarMetricas();