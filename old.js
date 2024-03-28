 http = require ('http');

const server = http.createServer((req,res) => {
    console.log('Request received');
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('HELLO WORLD!!');

})
server.listen(3000, () => {
    console.log('listening on port 3000')
})