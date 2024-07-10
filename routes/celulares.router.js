const router = require ('express').Router();
const {connectClient} = require("../db/postgres");
const Celular = require('../models/celulares');

router.get("/",async(req,res)=>{
   const client =await connectClient();
    try{
        const result =await client.query("SELECT * FROM todos");
        res.render("vistas/index",{Celulares:result.rows}); 

    } catch (error) {
        res.status(500).send(error.messages);
    }finally{
        await client.end();
    }
})



//post

module.exports = router;