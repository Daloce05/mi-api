const express = require ('express')
const app = express()
const PDFDocument = require('pdfkit');
const{ readFileSync, escribirarchivo} = require('./files')
const path = require('path');
//importar joi 
const Joi = require('joi');
//importar moment
const moment = require('moment');
const fs = require('fs')
const viewsPath = path.join(__dirname, 'src', 'views');
const publicPath = path.join(__dirname, 'src', 'public');
app.use(express.json()); 

const multer = require('multer');
const upload = multer({dest: 'upload/'});



app.use(express.json()); 
// 5 punto Middleware para agregar created_at al cuerpo de la solicitud
const usarcreated = (req, res, next) => {
  if (!req.body.created_at) {
    req.body.created_at = moment().format('YYYY-MM-DD hh:mm');
  }
  next();
};



//post de la libreria multer 
app.post('/images/single', upload.single('imagenperfil'), (req,res)  => {
  console.log(req.file);
   guardarimagen(req.file);
  res.send('exitoso');

})

//funcion libreria multer 
function guardarimagen(file){ 
  const newpath = `./upload/${file.originalname}`;
  fs.renameSync(file.path, newpath);
  return newpath;
}
  


function solicitud(req, res, next) {
  const fecha = moment().format('DD MM YYYY hh:mm:ss');
  const metodo = req.method;
  const url = req.url;
  const query = JSON.stringify(req.query);
  const body = JSON.stringify(req.body);
  const ip = req.ip;

  const linea = `${fecha} [${metodo}] ${url} ${query} ${body} ${ip}\n`;

  fs.appendFile('access_log.txt', linea, (err) => {
    if (err) {
      console.error(err);
    }
  });

  next();
}

app.use(solicitud);








//ruta home
app.get('/celulares', (req, res) =>{
    const celulares = readFileSync('./db.json')
    res.send(celulares)
  })
  





//ejercicio 2
//show
app.get('/celular', (req, res) => {
  const celulares = readFileSync('./db.json');

  // Verificar si se proporcionó un query parameter para filtrar los registros
  const filtro = req.query.filtro;
  const valor = req.query.valor;

  if (filtro) {
    // Filtrar los registros por el valor especificado en la propiedad indicada
    const celular_filtro = celulares.filter(celular=> celular[filtro] == valor);

    if (celular_filtro.length === 0) {
      // Si no se encuentran registros que coincidan con el filtro, enviar todos los registros
      res.send(celulares);
    } else {
      // Si se encuentran registros que coinciden con el filtro, enviar los registros filtrados
      res.send(celular_filtro);
    }
  } else {
    // Si no se proporcionó un query parameter, enviar todos los registros
    res.send(celulares);
  }
});

//comando postman http://localhost:3000/celular?filtro=id&valor=1








//store
// 1 punto metodo para agregar un celular a la lista de carros y validar los datos de entrada con Joi  
app.post('/celular',usarcreated, (req, res) => {
  // Definir esquema Joi para validar los datos de entrada
  const schema = Joi.object({
      // Define las propiedades que esperas en el cuerpo de la solicitud y sus respectivas validaciones
      nombre: Joi.string().required(),
      color: Joi.string().required(),
       id: Joi.number().required(),
       created_at: Joi.string().required(),
  });

  // Validar los datos de entrada
  const { error, value } = schema.validate(req.body);

  // Si hay un error en la validación, responder con un error 400
  if (error) {
      res.status(400).send(error.details[0].message);
      return;
  }

  // Continuar con el resto del código si los datos son válidos
  const celular = value; // Usamos 'value' que contiene los datos validados

  // Leer la lista de celulares desde el archivo
  const celulares = readFileSync('./db.json');

  // Agregar el nuevo celular a la lista
  celular.id = celulares.length + 1; // Asignamos un nuevo ID al celular
  celulares.push(celular);

  // Escribir la lista de carros actualizada en el archivo
  escribirarchivo('./db.json', celulares);

  // Responder con el celular agregado y un código de estado 201 (Created)
  res.status(201).send(celular);
});










//ejercicio 1
//metodo para actualizar un celular por id
app.put('/celulares/:id', (req, res) => {
  const id = req.params.id;

  // Definir esquema Joi para validar los datos de entrada
  const schema = Joi.object({
      // Aquí defines las propiedades que esperas en el cuerpo de la solicitud y sus respectivas validaciones
      nombre: Joi.string().required(),
      color: Joi.string().required(),
       id: Joi.number().required(),
       created_at: Joi.string().required(),
      // Puedes agregar más validaciones según tus necesidades
  });

  // Validar los datos de entrada
  const { error, value } = schema.validate(req.body);

  // Si hay un error en la validación, responder con un error 400
  if (error) {
      res.status(400).send(error.details[0].message);
      return;
  }

  const celulares = readFileSync('./db.json');
  const celular = celulares.find(celular => celular.id === parseInt(id));

  // Si no existe el celular
  if (!celular) {
      res.status(404).send('El celular no existe');
      return;
  }

  // Actualizar el celular
  const index = celulares.indexOf(celular);
  const celular_actualizado = { ...celular, ...value }; // Usamos 'value' que contiene los datos validados
  celulares[index] = celular_actualizado;

  // Escribir en el archivo
  escribirarchivo('./db.json', celulares);
  res.send(celular_actualizado);
});






// 3 punto metodo para actualizar el campo 'updated_at' en todos los registros
app.put('/celulares/cambiar', (req, res) => {
  const celulares = readFileSync('./db.json');

  // Obtener la fecha y hora actual en formato YYYY-MM-DD hh:mm
  const fechahoy = moment().format('YYYY-MM-DD hh:mm');

  // Recorrer todos los registros y actualizar el campo 'updated_at' si está vacío
  const celularcambiado = celulares.map(celular => {
    if (!celular.updated_at) {
      celular.updated_at = fechahoy;
    }
    return celular;
  });

  // Escribir en el archivo
  escribirarchivo('./db.json', celularcambiado);

  res.send(celularcambiado);
});

// como mandar la peticion http://localhost:3000/celular/cambiar
//se debe poner como comentario el primer put para que funcione el punto 3

















  
  app.delete('/celulares/:id', (req, res) =>{
    const data = readFileSync('./db.json');
    const id = parseInt(req.params.id);
    const celularindex = data.findIndex((celular) => celular.id === id);
    data.splice(celularindex, 1);
    escribirarchivo('./db.json',data);
    res.json({ message: "celular delete successfully" });
  })









  function generarPDF(celulares) {
    return new Promise((resolve, reject) => {
        // Crea un nuevo documento PDF
        const doc = new PDFDocument();
        const buffers = [];
      
        // Captura los datos del PDF en un buffer
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
  
        // Agrega contenido al PDF
        doc.fontSize(18).text('Lista de celulares', { align: 'center' }).moveDown();
        celulares.forEach((celular, index) => {
            doc.fontSize(12).text(`celular ${index + 1}: ${JSON.stringify(celular)}`).moveDown();
        });
  
        // Cierra el documento PDF
        doc.end();
    });
  }
  
  // Ruta GET para obtener el PDF con la lista de carros
  app.get('/lista_celulares.pdf', async (req, res) => {
    try {
        // Lee los carros desde el archivo JSON
        const celulares = readFileSync('./db.json');
  
        // Genera el PDF en memoria
        const pdfData = await generarPDF(celulares);
  
        // Configura los encabezados de la respuesta HTTP
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="lista_celulares.pdf"');
  
        // Envía el PDF como respuesta HTTP
        res.end(pdfData);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error al generar el PDF');
    }
  });





  // 4 punto Middleware para registrar las solicitudes HTTP en el archivo access_log.txt
app.use((req, res, next) => {
  const logLine = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

  // Agregar la línea al archivo access_log.txt
  fs.appendFile('access_log.txt', logLine, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo access_log.txt:', err);
    }
  });

  next();
});

//levantamos el servidor para el puerto 3000
app.listen(3000, () => {
    console.log('lisntening on port 3000');
})