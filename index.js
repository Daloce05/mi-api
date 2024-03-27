

const express = require ('express')
const fs = require('fs')
const{ readFileSync, escribirarchivo} = require('./files')
const app = express()
app.use(express.json())

  

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

//levantamos el servidor para el puerto 3000
app.listen(3000, () => {
    console.log('listening on port 3000');
})