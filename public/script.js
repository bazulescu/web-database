// Seleccionar el elemento con ID "app"
const app = document.getElementById('app');

// Crear un nuevo párrafo
const parrafo = document.createElement('p');
parrafo.textContent = 'Hola desde JavaScript';

// Agregar el párrafo al contenedor "app"
app.appendChild(parrafo);

// Agregar un event listener para el evento "click"
document.getElementById('miBoton').addEventListener('click', () => {
    alert('¡Ghost ransomware installed, you have been hacked!');
  });
