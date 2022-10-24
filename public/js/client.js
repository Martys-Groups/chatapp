const socket = io();


let username;
let chatBox = document.querySelector('.chats');
let msg_send = document.getElementById('msg-send')
let user_msg = document.getElementById('messageInp')
let user_list = document.querySelector('.users-list');
let user_count = document.querySelector('.users-count');

do {
    username = prompt('Write Your Name To enter:')
} while (!username)


socket.emit('new-user-joined', username);

socket.on('user-connected', (socket_name) => {
    userJoinedLeft(socket_name, 'joined')
});

function userJoinedLeft(name, status) {
    let div = document.createElement('div');
    div.classList.add('user-joined');
    let content = `<p><b>${name} </b> ${status} the chat </p>`;
    div.innerHTML = content;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

}

socket.on("user-disconnected", (user) => {
    userJoinedLeft(user, 'left');
});

socket.on('user-list', (users) => {
    user_list.innerHTML = "";
    users_arr = Object.value(users);
for(i=0;i<users_arr.length;i++){
    let p = document.createElement('p');
    p.innerText= users_arr[i];
    user_list.appendChild(p);
}
user_count.innerHTML = users_arr.length;

})


// messaging-system 
msg_send.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value
    };

    if (user_msg.value != '') {
        appendMsg(data, 'left');
        socket.emit('message', data);
        user_msg.value = '';
    };
})


function appendMsg(data, status) {
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `
   <h5>${data.user}</h5>
   <p>${data.msg}
   `;
    div.innerHTML = content;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
};

socket.on('message', (data) => {
    appendMsg(data, 'right');
})