const socket = io();

const $messageform = document.querySelector('#message-form');
const $messageforminput = document.querySelector('input');
const $messageformbutton = document.querySelector('button');
const $sendlocationbutton = document.querySelector('#send-location');

socket.on('conn', (args) => {
    console.log(args);
})

$messageform.addEventListener('submit', (e) => {
        e.preventDefault();

        $messageformbutton.setAttribute('disabled', 'disabled');

        const message = document.querySelector('input')?.value

        socket.emit('sendmessage', message, (sereverMSG) => {
            console.log('ok from client');
            console.log(sereverMSG)
            $messageformbutton.removeAttribute('disabled');
            $messageforminput.focus();
        });

        document.querySelector('input').value = '';
    })


socket.on('message', (message) => {
    console.log(message);
})

document.querySelector('#send-location')?.addEventListener('click', () => {
        if (!navigator.geolocation) {
            return alert('geo location is supported');
        }

        $sendlocationbutton.setAttribute('disabled', 'disabled');

        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('sendlocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }, (ack) => {
                console.log('client :' + 'location send ok!', 'server :' + ack);
                $sendlocationbutton.removeAttribute('disabled');
            })
        })
    })
