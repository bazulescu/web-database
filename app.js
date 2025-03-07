const express = require('express');
const { Client } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    user: process.env.DB_USER,        
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,           
});

client.connect()
    .then(() => {
        console.log('Conectado a la base de datos PostgreSQL');
    })
    .catch(err => {
        console.error('Error de conexión', err);   
    });

// Servir archivos estáticos
app.use(express.static('public'));

// Ruta para la página principal (listado de empleados)
app.get('/empleados', (req, res) => {
    client.query('SELECT * FROM empleados', (err, result) => {
        if (err) {
            res.status(500).send('Error al obtener los empleados');
        } else {
            let html = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Empleados</title>
                    <link rel="stylesheet" href="/style.css">
                </head>
                <body>
                    <h1>Lista de Empleados</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Empleado</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Edad</th>
                                <th>Salario</th>
                                <th>ID Departamento</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            result.rows.forEach(empleado => {
                html += `
                    <tr>
                        <td>${empleado.id_empleado}</td>
                        <td>${empleado.nombre}</td>
                        <td>${empleado.apellido}</td>
                        <td>${empleado.edad}</td>
                        <td>${empleado.salario}</td>
                        <td>${empleado.id_departamento}</td>
                    </tr>
                `;
            });

            html += `
                    </tbody>
                </table>
            </body>
            </html>
            `;

            res.send(html);
        }
    });
});

// Ruta dinámica para obtener un empleado por nombre
app.get('/empleados/:nombre', (req, res) => {
    const nombreEmpleado = req.params.nombre; // Obtener el nombre del parámetro de la URL
    const query = 'SELECT * FROM empleados WHERE nombre = $1'; // Consulta SQL con parámetro
  
    // Ejecutar la consulta en la base de datos
    client.query(query, [nombreEmpleado], (err, result) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error al buscar el empleado' });
        } else if (result.rows.length === 0) {
            res.status(404).json({ error: 'Empleado no encontrado' });
        } else {
            // Devolver el empleado encontrado en formato JSON
            const empleado = result.rows[0];
            res.json({
                id_empleado: empleado.id_empleado,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                edad: empleado.edad,
                salario: empleado.salario,
                id_departamento: empleado.id_departamento
            });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
