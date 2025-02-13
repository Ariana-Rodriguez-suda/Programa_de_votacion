const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.json());


app.use(express.static(__dirname)); 

let votantes = [];


app.post('/api/votar', (req, res) => {
    const nuevoVotante = req.body;

    
    if (!nuevoVotante.nombre || !nuevoVotante.cedula || !nuevoVotante.direccion) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    
    votantes.push(nuevoVotante);

    
    res.status(200).json({ message: 'Votante registrado correctamente', lugarVotacion: 'Centro de Votación Cuenca, Av. 12 de Abril' });
});


app.get('/api/votantes', (req, res) => {
    res.status(200).json(votantes);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
