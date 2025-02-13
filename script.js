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
        mostrarMapa(data.lugarVotacion);  // Muestra el lugar de votación aleatorio
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
    // Direcciones de los lugares de votación
    const lugaresVotacion = [
        "Escuela Ulises Chacón (4X77+HQ8, C. del Sarar, Cuenca)",
        "UNIDAD EDUCATIVA LAS PENCAS (y, Emilio López Ortega & De las Pencas, Cuenca)",
        "Escuela Fiscomisional Sagrado Corazon Todosantos (Pa. 3 de Noviembre, Cuenca 010107)",
        "Colegio Benigno Malo (3XWR+MXP, Av. Solano y Aurelio Aguilar, Av. Fray Vicente Solano, Cuenca)",
        "Colegio Manuela Garaicoa de Calderón (Camino del Valle &, Cuenca)",
        "Escuela De Educacion Basica República de Chile (Del Cabogan, Cuenca)",
        "Coliseo Jefferson Pérez Quezada (4X4J+93J, Cuenca)",
        "Coliseo Universitario (3XWQ+WJH, Honorato Loyola, Cuenca)",
        "Universidad de Cuenca (Av. 12 de Abril &, Cuenca)",
        "Universidad Politécnica Salesiana del Ecuador (C. Vieja 12-30 y, Cuenca 010105)"
    ];

    // Selección aleatoria de un lugar
    const lugarAleatorio = lugaresVotacion[Math.floor(Math.random() * lugaresVotacion.length)];

    // Crear el mapa centrado en Cuenca, Ecuador (coordenadas geográficas: lat, lng)
    var map = L.map('map').setView([-2.9000, -79.0040], 13); // Coordenadas de Cuenca

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Agregar un marcador en la ubicación aleatoria
    // Aquí se deberían usar las coordenadas correspondientes al lugar aleatorio
    // Pero para este ejemplo, usaremos coordenadas de Cuenca para todos
    var marker = L.marker([-2.9000, -79.0040]).addTo(map);
    marker.bindPopup(`<b>Lugar de Votación</b><br>${lugarAleatorio}`).openPopup();

    // Mostrar el lugar de votación en el texto de la página
    document.getElementById("lugarVotacion").textContent = `Lugar de votación: ${lugarAleatorio}`;
}

// Llamar a la función para inicializar el mapa
initMap();
