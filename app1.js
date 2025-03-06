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
app.get('/empleados/:nombre', (req, res) => {
    const nombreEmpleado = req.params.nombre; // Obtener el nombre del parámetro de la URL
    const query = 'SELECT * FROM empleados WHERE nombre = $1'; // Consulta postgreSQL con parámetro
  
    // Ejecutar la consulta en la base de datos
    client.query(query, [nombreEmpleado], (err, result) => {
      if (err) {
        console.error('Error al ejecutar la consulta:', err);
        res.status(500).json({ error: 'Error al buscar el empleado' });
      } else if (result.rows.length === 0) {
        res.status(404).json({ error: 'Empleado no encontrado' });
      } else {
        res.json(result.rows[0]); // Devolver el empleado encontrado
      }
    });
  });
app.listen(port, () => {
    console.log;
});
