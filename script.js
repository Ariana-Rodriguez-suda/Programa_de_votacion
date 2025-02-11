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
        mostrarMapa(data.direccion); // Usamos la dirección que se pasó
        actualizarTabla(); // Actualizar la tabla de votantes
    })
    .catch(error => {
        console.error("Error al registrar el votante:", error);
        alert("Error: " + error.message);
    });
});

function actualizarTabla() {
    fetch("http://localhost:3000/api/votantes")
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

function mostrarMapa(direccion) {
    const geocoder = new L.Control.Geocoder.Nominatim();

    // Limpiar el mapa anterior, si existe
    if (typeof map !== 'undefined') {
        map.remove();
    }

    // Inicializar el mapa
    const map = L.map('map').setView([0, 0], 2); // Vista inicial, por defecto (lat, lng)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    geocoder.geocode(direccion, function(results) {
        if (results.length > 0) {
            const latLng = results[0].center;
            map.setView(latLng, 15); // Cambiar el centro del mapa a la ubicación encontrada

            L.marker(latLng).addTo(map)
                .bindPopup(`<b>Lugar de votación:</b><br>${direccion}`)
                .openPopup();

            document.getElementById("lugarVotacion").textContent = `Lugar de votación: ${direccion}`;
        } else {
            alert("No se pudo encontrar la dirección.");
        }
    });
}
