const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 8000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const io = require('socket.io')(http)
const users={}
io.on('connection', (socket) => {
    socket.on('new-user-joined',name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined', name)
    });
    console.log('Connected...')
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name:users[socket.id]})
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    })

})