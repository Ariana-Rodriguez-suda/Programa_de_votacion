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
        console.log("Respuesta del servidor: ", data);  // Verifica la respuesta completa

        // Ahora verificamos la estructura de la respuesta
        if (data && data.ubicacion && data.ubicacion.lat && data.ubicacion.lon) {
            alert("Votante registrado correctamente");
            document.getElementById("lugarVotacion").textContent = "Lugar de votación: " + data.LugarVotacion;
            mostrarMapa(data.ubicacion.lat, data.ubicacion.lon);
            actualizarTabla();
        } else {
            alert("Error: Ubicación de votación no válida.");
        }
    })
    .catch(error => {
        alert("Error al registrar el votante: " + error);
    });
});
