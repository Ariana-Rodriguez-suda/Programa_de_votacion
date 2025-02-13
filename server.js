const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fetch = require('node-fetch'); // Para obtener coordenadas de direcciones

app.use(express.json());
app.use(express.static(__dirname));

let votantes = [];

// Coordenadas de algunas ubicaciones aleatorias en Cuenca
const ubicacionesAleatorias = [
    { lat: -2.90055, lon: -79.00453 },
    { lat: -2.90100, lon: -79.00300 },
    { lat: -2.90200, lon: -79.00200 }
];

async function obtenerCoordenadas(direccion) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}, Cuenca, Ecuador`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            console.error("Dirección no encontrada.");
            return null;
        }

        const resultado = data[0]; // Tomar el primer resultado disponible
        return { lat: parseFloat(resultado.lat), lon: parseFloat(resultado.lon) };
    } catch (error) {
        console.error("Error al obtener las coordenadas:", error);
        return null;
    }
}

function generarCoordenadasAleatorias() {
    const indiceAleatorio = Math.floor(Math.random() * ubicacionesAleatorias.length);
    const ubicacion = ubicacionesAleatorias[indiceAleatorio];

    console.log("Ubicación de votación generada: ", ubicacion); // Verifica la ubicación generada

    return ubicacion;
}

app.post('/api/votar', async (req, res) => {
    const nuevoVotante = req.body;

    if (!nuevoVotante.nombre || !nuevoVotante.cedula || !nuevoVotante.direccion) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    const ubicacionVotacion = generarCoordenadasAleatorias(); // Usamos una ubicación aleatoria para la votación

    if (!ubicacionVotacion || !ubicacionVotacion.lat || !ubicacionVotacion.lon) {
        return res.status(500).json({ message: 'Error generando la ubicación de votación' });
    }

    votantes.push({ ...nuevoVotante, ubicacion: ubicacionVotacion });

    console.log("Respuesta del servidor: ", {
        message: 'Votante registrado correctamente',
        LugarVotacion: `Centro de Votación Cuenca, Av. 12 de Abril`,
        ubicacion: ubicacionVotacion
    }); // Verifica la respuesta enviada

    res.status(200).json({
        message: 'Votante registrado correctamente',
        LugarVotacion: `Centro de Votación Cuenca, Av. 12 de Abril`,
        ubicacion: ubicacionVotacion
    });
});

app.get('/api/votantes', (req, res) => {
    res.json(votantes);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
