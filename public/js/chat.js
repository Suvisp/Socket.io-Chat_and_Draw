import socket from './net.js'

// username is used to be compared with 'from' in 'msg' events
let username;
let users = [];
let randomWord;
let points = 0;
let message;

window.addEventListener('load', () => {

    const $loginForm = document.getElementById('loginForm')
    const $nameInput = document.getElementById('nameInput')
    const $messageInput = document.getElementById('messageInput');
    const $messageForm = document.getElementById('messageForm')
    const $messagesContainer = document.getElementById('messagesContainer')
    const $canvas = document.getElementById('canvas')
    const $canvasButtonsRow = document.getElementById('canvasButtonsRow')
    // const $peoplelist = document.getElementById('peoplelist')
    const $users = document.getElementById('users')

    // Login
    $loginForm.addEventListener('submit', function (event) {
        event.preventDefault()
        // Login with `name`
        let name = $nameInput.value;
        login(name)
        // addList(name)

        // Remove the login form and show other UI components
        $loginForm.remove()
        $messageForm.classList.remove('hidden')
        $canvas.classList.remove('hidden')
        $canvasButtonsRow.classList.remove('hidden')
    })

    // Send Message
    $messageForm.addEventListener('submit', function (event) {
        event.preventDefault()
        // const message = $messageInput.value;
        message = $messageInput.value;
        $messageInput.value = "";
        // Send
        socket.emit('msg', message)
        //     //tsekkaa mätkääkö sanat
        checkifmatches()
    })


    function login(name) {
        username = name;
        socket.emit('login', username)

        // Recieve Messages
        socket.on('msg', (data) => {
            if (data.from != username) {
                say(data.from, data.message)
            } else {
                say('me', data.message)
            }
        })
        // listener, whenever the server emits 'updateusers', this updates the username list
        socket.on('updateusers', function (data) {
            $('#users').empty();
            $.each(data, function (key, value) {
                $('#users').append('<div>' + key + '</div>');
            });
        });

    }

    function say(name, message) {
        $messagesContainer.innerHTML +=
            `<div class="chat-message">
            <span style="color: red; font-weight: bold;">${name}:</span> <span class="msg">${message}</span>
        </div>`
        // Scroll down to last message
        $messagesContainer.scrollTop = $messagesContainer.scrollHeight
    }

    // //tsekkaa mätkääkö sanat
    function checkifmatches() {
        if (message = randomWord) {
            alert('sanat mätsää!')
            osuma();
        }
    }

    //pisteet
    function osuma() {
        points += 1;
        console.log(points);
        addPointstoLocalStorage();
    }

    //lisää pisteet SessionStorageen
    function addPointstoLocalStorage() {
        let scores = parseInt(sessionStorage.getItem("scores"));
        sessionStorage.setItem("scores", points);
        //näyttää kertyneet pisteet sivulla
        document.getElementById("scores").innerHTML = `Pisteeni: ${sessionStorage.getItem("scores")}`;
    }

    //     function addList(name) {
    socket.on('join', function (user) {
        socket.name = user.name;
        users.push(socket.name);
        io.emit('user joined', { 'name': user.name, users: users });
    });

    // getWord button
    document.getElementById("getwordbtn").addEventListener("click", getword)

    function getword(event) {
        word.innerHTML = "";
        // console.dir(this);
        // console.dir(event);
        console.log("get words");
        getWordApi().then(allwords => {
            console.log(allwords);
            //Arpoo random sanan tietokannan sanoista
            // let randWord = "";
            const randNum = Math.floor(Math.random() * allwords.length)
            let randWord = allwords[randNum].word
           this.randomWord = randWord 
            // socket.emit('word', randomWord)
            // } )
            //Ohje pelaajalle -> Piirrä: randomsana
            word.innerHTML = `Piirrä: ` + randWord;
            // this.randWord = randWord;
        })
        //         .catch((error) => {
        //             console.error('Error:', error);
        //         });
        // }

        function getWordApi() {
            return fetch("/draw/Piirtoalias/word")
                .then(res => res.json());
        }
    }
    //         // let users = [];
    //         // socket.emit('addList', name)
    //         // // Recieve userlist
    //         // socket.on('addList', (data) => {
    //         //     if (username) {
    //         //         say(data.from, data.message)
    //         //     } else {
    //         //         say('me', data.message)
    //         //     }
    //         // })
    //         // peoplelist = [];
    //         // peoplelist.push(name);
    //         // console.log(peoplelist);
    //         // for (let p of peoplelist) {
    //         // let aiheLista = "";
    //         $peoplelist.innerHTML +=
    //             //     `
    //             //     ${users.map(user => `<li>${user.name}</li>`).join('')}
    //             //   `;
    //             `<div class="peoplelist">
    //         <span style="color: red">${name}:</span>
    //     </div>`
    //     }

    //     // Get users
    //     // socket.on('users', ({ users }) => {
    //     //     addList(users);
    //     //   });

})

