const socketChat = io()

    let user;
    let chatBox = document.getElementById('chatBox');
let log = document.getElementById('messageLogs');
let data;
let btnDelete = document.getElementById('delete-btn');

socketChat.on('message', msg => {
    data = msg;
    renderizar(msg);
});

socketChat.on('messageLogs', msgs => {
    console.log('mensaje nuevo')
    renderizar(msgs);

    
})



const renderizar = (msgs) => {

    let messages = '';

    msgs.forEach(message => {
        const isCurrentUser = message.user === user;
        const messageClass = isCurrentUser ? 'my-message' : 'other-message';
        messages = messages + `<div class= message-container><p class="${messageClass}">${message.user}: ${message.message}</p></div>`;
    });

    log.innerHTML = messages;
    chatBox.scrollIntoView(false);

};

Swal.fire({
    title: "Identificate",
    input: "email",
    text: "Please put your email address to proceed",
    inputValidator: (value)=>{
        if(!value)
            return 'You need a valid email address to continue'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) 
            return 'You need a valid email address to continue'
        return null;
    },
    allowOutsideClick: false
}) .then(result =>{
    if (result.isConfirmed){
        user = result.value;
        console.log('Trabis, no')
        renderizar(data);
    }
});

        chatBox.addEventListener('keyup', e => {
            if (e.key === 'Enter'){
                if(chatBox.value.trim().length > 0){
                    console.log('Trabis, enter')
                    const message = chatBox.value;
                    socketChat.emit('message', {user, message});
                    
                    chatBox.value = '';
                }
            }
        });


socketChat.on('nuevo_user', ()=>{
    Swal.fire({
        text: 'Nuevo usuario se ha conectado',
        toast: true ,
        position: 'top-right'
    })
})

btnDelete.addEventListener('click', ()=>{
    socketChat.emit('delete')
    location.reload()
})