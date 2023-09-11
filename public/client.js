const socket = io()
let userName;
const form = document.getElementById('client_sender_msg')
const messageInput = document.getElementById('user_msg')
const messageContainer = document.querySelector('.container1')
const audio1 = new Audio('/SentTune.mp3');
const audio2 = new Audio('/ReceiveTune.mp3');


do {
    userName = prompt('Please enter your name: ')
} while (!userName)
socket.emit('new-user-joined', userName);

socket.on('user-joined', userName => {
    appendMessage(`${userName} join the chat`, 'left');
})
socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message} `, 'left');
})

socket.on('left', name => {
    appendMessage(`${name} Disconnect `, 'left');
})

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const appendMessage = (message, position) => {
    let mainDiv = document.createElement('div');
    mainDiv.innerText = message;
    mainDiv.classList.add('msg');
    mainDiv.classList.add(position);
    messageContainer.append(mainDiv);

    scrollToBottom();
    if(position=='right'){
    audio1.play();
    }
    else{
       audio2.play();
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})
