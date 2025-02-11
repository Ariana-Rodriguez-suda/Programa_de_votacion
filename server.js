const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para analizar las solicitudes JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta raíz del proyecto
app.use(express.static(__dirname)); // Usamos __dirname para servir archivos desde la raíz

let votantes = [];

// Ruta para registrar un votante
app.post('/api/votar', (req, res) => {
    const nuevoVotante = req.body;

    // Verificar que los datos necesarios estén presentes
    if (!nuevoVotante.nombre || !nuevoVotante.cedula || !nuevoVotante.direccion) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Agregar votante al arreglo
    votantes.push(nuevoVotante);

    // Responder con un mensaje de éxito
    res.status(200).json({ message: 'Votante registrado correctamente', lugarVotacion: 'Centro de Votación Cuenca, Av. 12 de Abril' });
});

// Ruta para obtener todos los votantes
app.get('/api/votantes', (req, res) => {
    res.status(200).json(votantes);
});

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
app.post('/api/votar', (req, res) => {
    const nuevoVotante = req.body;

    if (!nuevoVotante.nombre || !nuevoVotante.cedula || !nuevoVotante.direccion) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Agregar votante al arreglo
    votantes.push(nuevoVotante);

    // Responder con un mensaje de éxito, incluyendo la dirección
    res.status(200).json({ 
        message: 'Votante registrado correctamente', 
        lugarVotacion: 'Centro de Votación Cuenca, Av. 12 de Abril',
        direccion: nuevoVotante.direccion // Pasamos la dirección para usarla en el mapa
    });
});
