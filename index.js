const express = require ('express')
const app = express()
const path = require('path');
const routesCel = require('./routes/rutas-celular'); // Importa las rutas de los carros
const db = require('./models');
const bodyParser = require('body-parser');
app.use(express.json()); 

app.use(bodyParser.json())
//ruta de celulares
app.use('/api/celular', routesCel);



  db.sequelize.sync().then(() => {
    app.listen(3000, () => {
      console.log(`Servidor corriendo en http://localhost:${3000}`);
    });
  }).catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });
  

//levantamos el servidor para el puerto 3000