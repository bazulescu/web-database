const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

const client = new Client({
    user: 'postgres',        
    password: 'universae', 
    database: 'empresa', 
    host: 'localhost',
    port: 5432 ,          
});

client.connect()
    .then(() => {
        console.log('Conectado a la base de datos PostgreSQL');
    })
    .catch(err => {
        console.error('Error de conexión', err);   
    });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

app.get('/empleados', (req, res) => {
    client.query('SELECT * FROM empleados', (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result.rows); // Muestra los datos en formato JSON
        }
    });
});

app.listen(port, () => {
    console.log;
});
