const express = require ('express')
const fs = require('fs')
const{ readFileSync, escribirarchivo} = require('./files')
const PDFDocument = require('pdfkit');

const app = express()
app.use(express.json())
const multer = require('multer');
const upload = multer({dest: 'upload/'});

app.post('/images/single', upload.single('imagenperfil'), (req,res)  => {
  console.log(req.file);
   guardarimagen(req.file);
  res.send('exitoso');

})

function guardarimagen(file){ 
  const newpath = `./upload/${file.originalname}`;
  fs.renameSync(file.path, newpath);
  return newpath;
}
  

//ruta home
app.get('/celulares', (req, res) =>{
    const celulares = readFileSync('./db.json')
    res.send(celulares)
  })
  
//show
app.get('/celulares/:id', (req,res) => {
    const id = req.params.id
    const celulares = readFileSync('./db.json')
    const celular = celulares.find(celular => celular.id === parseInt(id))
    //no existe
    if(! celular == undefined){
        res.status(404).send('no existe')
        return
    }
    //existe
    res.send(celular)

})
//store
app.post('/celulares', (req, res) => {
    const celular = req.body
    const celulares = readFileSync('./db.json') 
    celular.id = celulares.length + 1    
    celulares.push(celular)
    //escribir arcihvo  
    escribirarchivo('./db.json', celulares)
    res.status(201).send(celular)   
})


app.put('/celulares/:id', (req, res) =>{
    const data = readFileSync('./db.json');
    const body = req.body;
    const id = parseInt(req.params.id);
    const celularindex = data.findIndex((celular) => celular.id === id);
    data[celularindex] = { 
      ...data[celularindex],
      ...body,
    };
    escribirarchivo('./db.json',data);
    res.json({ message: "celular update successfully" });
  });
  
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


//levantamos el servidor para el puerto 3000
app.listen(3000, () => {
    console.log('listening on port 3000');
})