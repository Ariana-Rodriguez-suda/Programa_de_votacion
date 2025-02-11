document.getElementById("formVotacion").addEventListener("submit", function (e) {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value,
        cedula: document.getElementById("cedula").value,
        direccion: document.getElementById("direccion").value,
        telefono: document.getElementById("telefono").value,
        ciudad: document.getElementById("ciudad").value,
        estadoCivil: document.getElementById("estadoCivil").value
    };

    fetch("http://localhost:3000/api/votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        alert("Votante registrado: " + data.message);
        mostrarMapa(data.lugarVotacion);
        actualizarTabla(); // Actualizar la tabla de votantes
    })
    .catch(error => {
        console.error("Error al registrar el votante:", error);
        alert("Error: " + error.message);
    });
});

function actualizarTabla() {
    fetch("http://localhost:3000/api/votantes")  // Obtener todos los votantes
    .then(response => response.json())
    .then(votantes => {
        const tbody = document.getElementById("votersTable");
        tbody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos registros
        votantes.forEach(votante => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${votante.nombre}</td>
                <td>${votante.cedula}</td>
                <td>${votante.direccion}</td>
                <td>${votante.telefono}</td>
                <td>${votante.ciudad}</td>
                <td>${votante.estadoCivil}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error al cargar los votantes:", error);
    });
}

function mostrarMapa(lugar) {
    // Crear el mapa centrado en Cuenca, Ecuador (coordenadas geográficas: lat, lng)
    var map = L.map('map').setView([-2.9000, -79.0040], 13); // Coordenadas de Cuenca

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Agregar un marcador en la ubicación de Cuenca
    var marker = L.marker([-2.9000, -79.0040]).addTo(map);
    marker.bindPopup("<b>Ciudad de Cuenca</b><br>Lugar de votación").openPopup();
}

// Llamar a la función para inicializar el mapa
initMap();
