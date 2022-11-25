const socket = io();

const $messageform = document.querySelector('#message-form');
const $messageforminput = document.querySelector('input');
const $messageformbutton = document.querySelector('button');
const $sendlocationbutton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

const messagetemplate = document.querySelector('#message-template').innerHTML
const locationmessagetemplate = document.querySelector('#location-message-template').innerHTML

const {username , room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
socket.on('conn', (args) => {
    console.log(args);
    const html = Mustache.render(messagetemplate,{
        message:args.text,
        createdAt:moment(args.createdAt).format('h:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('location_message',(url)=>{
    console.log(url);
    const html = Mustache.render(locationmessagetemplate,{
        url:url.text,
        createdAt:moment(url.createdAt).format('h:mm:a')
    })

    $messages.insertAdjacentHTML('beforeend',html)
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
    const html = Mustache.render(messagetemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:a')
    });
    $messages.insertAdjacentHTML('beforeend',html)
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

    socket.emit('join',{username , room})