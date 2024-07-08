const express = require('express');
const router = express.Router();
const db = require('../models'); // Importa la configuración de Sequelize y los modelos
const celulares = require('../models/celulares');
const { Celular } = db; // Asegúrate de importar correctamente el modelo celular

//obtener todos los celulares por medio de un get 
router.get('/', async (req, res) => {
    try {
        const celulares = await Celular.findAll(); // Usar el modelo correctamente
        res.json(celulares); // Devolver el resultado de la consulta
    } catch (error) {
        console.error('Error al obtener celulares:', error);
        res.status(500).json({ message: 'Error al obtener celulares' });
    }
});

//obtener un celular por ID por medio de un get 
router.get('/:id', async (req, res) => {
    try {
        const celular = await Celular.findByPk(req.params.id);
        if (!celular) {
            return res.status(404).json({ message: 'Celular no encontrado' });
        }
        res.json(celular);
    } catch (error) {
        console.error('Error al obtener celular por ID:', error);
        res.status(500).json({ message: 'Error al obtener celular por ID' });
    }
});


//agregar correctamente un nuevo celular 
router.post('/', async (req, res) => {
    try {
      const { nombre, marca, color, price, almacenamiento, descripcion, ubicacion, stock, image } = req.body;
      const newcel = await Celular.create({
        nombre,
        marca,
        color,
        price,
        almacenamiento,
        descripcion,
        ubicacion,
        stock,
        image
      });
      res.json(newcel);
    } catch (error) {
      console.error('Error al crear celular:', error);
      res.status(500).json({ message: 'Error al crear carro' });
    }
  });


  //utilizamos el metodo put para actualizar un celular por su ID
  router.put('/:id', async (req, res) => {
    try {
        const celular = await Celular.findByPk(req.params.id);
        if (!celular) {
            return res.status(404).json({ message: 'Celular no encontrado' });
        }
        
        // Valores antiguos del celular
        const oldValues = {
            nombre: celular.nombre,
            marca: celular.marca,
            color: celular.color,
            price: celular.price,
            almacenamiento: celular.almacenamiento,
            descripcion: celular.descripcion,
            ubicacion: celular.ubicacion,
            stock: celular.stock,
            image: celular.image
        };

        // Actualizar el celular con los nuevos valores
        const updatedCelular = await celular.update(req.body);

        // Enviar la respuesta con los valores antiguos y los nuevos
        res.json({
            oldValues,
            newValues: updatedCelular
        });
    } catch (error) {
        console.error('Error al actualizar celular:', error);
        res.status(500).json({ message: 'Error al actualizar celular' });
    }
});

// delete para eliminar un carro por su ID 
router.delete('/:id', async (req, res) => {
    try {
        const celular = await Celular.findByPk(req.params.id);
        if (!celular) {
            return res.status(404).json({ message: 'Celular no encontrado' });
        }
        await celular.destroy();
        res.json({ message: 'Celular eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar celular:', error);
        res.status(500).json({ message: 'Error al eliminar celular' });
    }
});


module.exports = router;