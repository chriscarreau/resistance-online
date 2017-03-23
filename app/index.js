var gameport    = process.env.PORT || 4004;
var UUID        = require('node-uuid');
var path        = require('path');
var express     = require('express');
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var Game        = require('./game.js');
var Player      = require('./player.js');
var Mission     = require('./mission.js');
var tools       = require('./tools.js');
const util      = require('util');

//game variables
var games = [];

app.use('/', express.static(path.resolve('./Client/static/')));

app.get('*', function (request, response){
  response.sendFile(path.resolve('./Client/static', 'index.html'))
})

io.on('connection', function(socket){
    console.log('connection: '+ socket.id);
    var game;
    socket.on('hostGame', function(options){
        if(options.gameId){
            game = findGame(options.gameId);
            if(game === null){
                console.log('game introuvable');
                socket.emit('gameNotFound');
                return;
            }
        }
        else{
            game = new Game();
            game.gameId = makeUniqueId();
            games.push(game);
        }
        game.hostId = socket.id;
        io.to(game.hostId).emit('gameUpdate', game);
        console.log('total number of games: ' + games.length);
        socket.join(game.gameId);
    });
    socket.on('joinGame', function(options){
        var game = findGame(options.gameId);
        if(game === null){
            console.log('game introuvable');
            socket.emit('gameNotFound');
            return;
        }
        var player = game.getPlayer(options.playerId);
        if( player === null){
            player = new Player();
            player.playerName = options.playerName
            game.addPlayer(player);
            console.log('new player joined game: ' + game.gameId);
            console.log(util.inspect(game));
            console.log('total number of games: ' + games.length);
        }
        player.playerId = socket.id;
        socket.join(game.gameId);
        if(game.players.length == 1){
            game.firstPlayer = player;
        }
        io.to(game.gameId).emit('gameUpdate', game);
    });

    socket.on('gameUpdate', function(clientAction){
        var game = findGame(clientAction.gameId);
        if(game === null){
            console.log('game introuvable');
            socket.emit('gameNotFound');
            return;
        }
        game.update(io, clientAction);
        if(game.gameState === tools.GameStateEnum.GAME_OVER){
            //La game est fini, on la supprime
            
            //force les clients à se déconnecter/revenir au portail
            io.to(game.gameId).emit('gameNotFound');
        }
    });
});

http.listen(gameport, function(){
    console.log('listening on *:' + gameport);
});

function findGame(gameId){
    for(var i = 0; i < games.length; i++){
        if(games[i].gameId === gameId){
            return games[i];
        }
    }
    return null;
}

function makeUniqueId()
{
    var text = "";
    var possible = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

    do{
        var text = "";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    } while(findGame(text) !== null);

    return text;
}