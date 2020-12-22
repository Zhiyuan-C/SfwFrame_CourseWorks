module.exports = {
    connect: (io, PORT)=>{
        io.on('connection', (socket)=>{
            console.log(`User connection on port ${PORT} : ${socket.id}`);

            socket.on('message', (message)=>{
                io.emit('message', message);
            });

        });
    }
}