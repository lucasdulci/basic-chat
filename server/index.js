 

 const http = require('http');

 const server = http.createServer();

 const io = require('socket.io')(server, {
    cors: {origin: '*'}
 });

 io.on('connection', (socket) => {
    console.log('Connect User')

    socket.on('chat_message', (data) => {
        io.emit('chat_message', data)
    })

 })

 server.listen(process.env.PORT || 3000);