var socket;

window.onload = function(){
    socket = io();
    socket.on('message', function(msg){
        console.log(msg);
    });
    socket.on('gameEvent', function(msg){
        console.log(msg);
    });
    socket.on('firstPlayer', function(){
        document.querySelector("#gameDiv").style.display = 'block';
    });
    socket.on('gameReadyToStart', function(){
        document.querySelector("#attenteJoueurs").style.display = 'none';
        document.querySelector("#btnStartGame").style.display = 'block';
    });
    socket.on('playerJoined', function(player){
        var p = document.createElement('p');
        p.innerText = player.playerName;
        document.querySelector("#listPlayer").appendChild(p);
    });
    socket.on('role', function(data){
        document.querySelector("#gameDiv").style.display = 'block';
        document.querySelector("#attenteJoueurs").style.display = 'none';
        document.querySelector("#roleDiv").innerText = data;
        document.querySelector("#btnAccepteRole").style.display = 'block';
    });

    document.querySelector("#joinForm").style.display = 'none';



    document.querySelector("#btnCreateGame").onclick = function(){
        socket.emit('newGame');
        document.querySelector("#attenteJoueurs").style.display = 'none';
        document.querySelector("#gameDiv").style.display = 'block';
    };
    document.querySelector("#btnJoinGameForm").onclick = function(){
        console.log("montre join une game form");
        document.querySelector("#joinForm").style.display = 'block';
    };
    document.querySelector("#btnJoinGame").onclick = function(){
        gameOptions = {
            gameId:document.querySelector('#roomName').value,
            playerName:document.querySelector('#playerName').value,
            playerId:socket.id
        }
        socket.emit('joinGame', gameOptions);
    };
    document.querySelector("#btnStartGame").onclick = function(){
        gameOptions = {
            gameId:document.querySelector('#roomName').value,
            playerName:document.querySelector('#playerName').value,
            playerId:socket.id
        }
        socket.emit('startGame', gameOptions);
    };
    document.querySelector("#btnAccepteRole").onclick = function(){
        gameOptions = {
            gameId:document.querySelector('#roomName').value,
            playerName:document.querySelector('#playerName').value,
            playerId:socket.id
        }
        socket.emit('acceptRole', gameOptions);
    };
};