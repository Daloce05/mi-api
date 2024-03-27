// const { info } = require('console');
//  const e = require('express');
const fs = require('fs');
function readFileSync(path){
    const data = fs.readFileSync(path);
    const celulares = JSON.parse(data).celulares;
    return celulares;
}
function escribirarchivo(path, info){
    const data =JSON.stringify({'celulares': info});
    fs.writeFileSync(path, data);

}
module.exports = {
    readFileSync,
    escribirarchivo
}