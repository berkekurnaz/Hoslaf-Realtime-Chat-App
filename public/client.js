var socket = io();

let AREA_CHANGE_USERNAME = document.getElementById("areaJoinRoom");
let AREA_ROOM_SCREEN = document.getElementById("areaRoomScreen");

let TXT_USERNAME = document.getElementById("txtUsername");
let TXT_ROOM_ID = document.getElementById("txtRoomId");

let TXT_ROOM_USERS = document.getElementById("txtRoomUsers");
let TXT_WELCOME_ROOM = document.getElementById("txtWelcomeRoom");
let TXT_MESSAGE = document.getElementById("txtMessage");
let MESSAGE_LIST = document.getElementById("messageList");

socket.on('total_user_count', (msg) => {
    document.getElementById("txtTotalUserCount").innerHTML = msg;
});

socket.on('room_users', (msg) => {
    document.getElementById("txtRoomUserCount").innerHTML = msg.length;
    TXT_ROOM_USERS.innerHTML = ""
    msg.forEach(element => {
        var item = document.createElement('li');
        item.textContent = element.username;
        item.className = "list-group-item";
        if(element.id == socket.id){
            item.textContent += " (you)";
        }
        TXT_ROOM_USERS.appendChild(item);
    });
});

socket.on('send_message', (msg) => {
    let messageContent = " <p class='card'><b>" + msg.username + ": </b>" + msg.message + "</p>";
    MESSAGE_LIST.innerHTML = messageContent + MESSAGE_LIST.innerHTML;
});

socket.on('old_messages', (msg) => {
    msg.forEach(element => {
        let messageContent = " <p class='card'><b>" + element.username + ": </b>" + element.content + "</p>";
        MESSAGE_LIST.innerHTML = messageContent + MESSAGE_LIST.innerHTML;
    });
});

/* CHANGE USERNAME */
function joinGame() {
    if(TXT_ROOM_ID.value.length > 1){
        socket.emit('join_room', {
            username: TXT_USERNAME.value,
            room_id: TXT_ROOM_ID.value
        });
        AREA_CHANGE_USERNAME.style.display = "none";
        AREA_ROOM_SCREEN.style.display = "block";
        TXT_WELCOME_ROOM.innerHTML = "Welcome To Room " + TXT_ROOM_ID.value;
    }
}

function sendMessage(){
    if(TXT_MESSAGE.value.length > 1) {
        socket.emit('send_message', {
            username: TXT_USERNAME.value,
            room_id: TXT_ROOM_ID.value,
            message: TXT_MESSAGE.value
        });
        TXT_MESSAGE.value = "";
    }
}

Array.from(document.getElementsByClassName("badge")).forEach(element => {
    element.addEventListener("click", function(){
        TXT_ROOM_ID.value = element.innerHTML;
    });
});