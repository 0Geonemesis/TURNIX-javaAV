// 1. DIBUJAR EL GRÁFICO ESTADÍSTICO (CHART.JS)
document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById('graficoCitas').getContext('2d');
    
    new Chart(ctx, {
        type: 'line', // Tipo de gráfico: Línea
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Citas Atendidas',
                data: [12, 19, 15, 25, 22, 30, 10], // Datos simulados
                borderColor: '#0d6efd', // Azul de Bootstrap
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4 // Curva suave en la línea
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false } // Ocultamos la leyenda para que se vea más limpio
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // 2. INYECTAR DATOS EN LA LISTA DE ÚLTIMAS CITAS
    const listaCitas = document.getElementById("listaUltimasCitas");
    const citasEjemplo = [
        { cliente: "Ana García", servicio: "Consultoría", hora: "09:00 AM", estado: "Completado", color: "success" },
        { cliente: "Carlos López", servicio: "Revisión", hora: "10:30 AM", estado: "En Espera", color: "warning" },
        { cliente: "María Torres", servicio: "Soporte", hora: "11:15 AM", estado: "Pendiente", color: "secondary" },
        { cliente: "Luis Gómez", servicio: "Asesoría", hora: "02:00 PM", estado: "Pendiente", color: "secondary" }
    ];

    listaCitas.innerHTML = "";
    citasEjemplo.forEach(cita => {
        const item = `
            <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom px-4 py-3">
                <div class="ms-2 me-auto">
                    <div class="fw-bold text-dark">${cita.cliente}</div>
                    <small class="text-muted">${cita.servicio} - <i class="fa-regular fa-clock"></i> ${cita.hora}</small>
                </div>
                <span class="badge bg-${cita.color} rounded-pill mt-1">${cita.estado}</span>
            </li>
        `;
        listaCitas.innerHTML += item;
    });
});