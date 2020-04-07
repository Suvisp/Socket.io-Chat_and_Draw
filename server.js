const express = require('express');
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const logger = require('morgan')
var cors=require('cors')

const port = process.env.PORT || 3000
app.set('port', port)
http.listen(port, () => console.log('listening on port ' + port));

app.use(cors())

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));

// middleware
app.use(logger('dev'))

//Room - PiirtoAlias
const namespaces = ['PiirtoAlias'];


namespaces.map(ns => io.of(`/${ns}`))
.forEach(ns => {
    // users is a key-value pairs of socket.id -> user name
    let users = {};
    allUsers = []
    ns.on('connection', (socket) => {
        // Every socket connection has a unique ID
        console.log('new connection: ' + socket.id)
        
        // User Logged in
        socket.on('login', (name) => {
            console.log('login', name)
            // Map socket.id to the name
            users[socket.id] = name;
           // update the list of users in chat, client-side
		io.emit('updateusers', users);
            
            // Broadcast to everyone else (except the sender).
            // Say that the user has logged in.
            socket.broadcast.emit('msg', {
                from: 'server',
                message: `${name} logged in.`
            })
            console.log(users);
            // for (let i = 0; i < users.lenght; i++) { //luuppaa läpi kolme ensimmäistä hakutulosta
            //     //Hakee nimen ja sen alle listalementeiksi valitus ravintosisällöt:
            //     var uusili = "";
            //     uusili += `${users[i].name} <li> ${(users[i].name)</li>`;
            //     console.log(uusili);
        //     push.allUsers(users.name);
        //     console.log(allUsers);
        //      // User Added to list
        //   socket.on('addList', (name) => {
        //     console.log('addList', name)
        //     // Map socket.id to the name
        //     users[socket.id] = name;
        
        // })
        })
        // Message Recieved
        socket.on('msg', (message) => { 
            console.log('msg', message)
            // Broadcast to everyone else (except the sender)
            socket.broadcast.emit('msg', {
                from: users[socket.id],
                message: message
            })
            // Send back the same message to the sender
            socket.emit('msg', {
                from: users[socket.id],
                message: message
            })
            // You could just do: io.emit('msg', ...)
            // which will send the message to all, including
            // the sender.
        })
        
        // Disconnected
        socket.on('disconnect', function() {
            // Remove the socket.id -> name mapping of this user
            let name;
            if (socket.id in users) {
                name = users[socket.id]
            } else {
                name = socket.id
            }
            console.log('disconnect: ' + name)
            
            socket.broadcast.emit('msg', {
                from: 'server',
                message: `${name} disconnected.`
            })
            
            delete users[socket.id]
            // io.emit('disconnect', socket.id)
        })
    
    
        // Drawing
        socket.on('mouseDown', ([x, y]) => socket.broadcast.emit('mouseDown', [x, y]))
        socket.on('mouseMove', ([x, y]) => socket.broadcast.emit('mouseMove', [x, y]))
        socket.on('mouseUp', () => socket.broadcast.emit('mouseUp'))
        socket.on('clear', () => socket.broadcast.emit('clear'))
        socket.on('undo', () => socket.broadcast.emit('undo'))
        socket.on('setColor', (c) => socket.broadcast.emit('setColor', c))
        socket.on('setThickness', (r) => socket.broadcast.emit('setThickness', r))
    })

})

// Routes
app.get('/lobby', (req, res) => {
    res.render('lobby', {
        namespaces: namespaces
    })
})
app.get('/',     (req, res) => res.redirect('/lobby'))
app.get('/draw', (req, res) => res.redirect('/lobby'))

app.get('/draw/:namespace', (req, res) => {
    const ns = req.params['namespace'];
    if (!namespaces.includes(ns)) {
        return res.sendStatus(404);
    }
    res.render('draw')
})

var wordRouter = require('./routes/word');

app.use('/draw/Piirtoalias/word', wordRouter);

