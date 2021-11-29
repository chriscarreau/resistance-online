import path from "path";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import util from "util";
import { Game } from "./game";
import { Player } from "./player";
import { ClientUpdateAction, GameStateEnum } from "./tools";

var gameport    = process.env.PORT || 8080;
var app         = express();
var httpServer  = http.createServer(app);
var io          = new Server(httpServer);

//game variables
const games: Game[] = [];

app.use('/', express.static(path.resolve('./Client/static/')));

app.get('*', (request, response) => {
  response.sendFile(path.resolve('./Client/static', 'index.html'))
})

io.on('connection', (socket) => {
    console.log('connection: '+ socket.id);
    var game;
    socket.on('hostGame', function(options){
        if(options.gameId){
            game = findGame(options.gameId);
            if(!game){
                console.log('game introuvable');
                socket.emit('gameNotFound');
                return;
            }
            game.hostId = socket.id;
        }
        else{
            game = new Game(makeUniqueId(), socket.id);
            games.push(game);
        }
        io.to(game.hostId).emit('gameUpdate', game);
        console.log('total number of games: ' + games.length);
        socket.join(game.gameId);
    });
    socket.on('joinGame', function(options){
        var game = findGame(options.gameId);
        if(!game){
            console.log('game introuvable');
            socket.emit('gameNotFound');
            return;
        }
        var player = game.getPlayer(options.playerId);
        if(!player){
            if (game.gameState !== GameStateEnum.NOT_STARTED) {
                console.log('game already started, can\'t join you bozo');
                socket.emit('gameNotFound');
                return;
            }
            player = new Player(socket.id, options.playerName);
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

    socket.on('gameUpdate', function(clientAction: ClientUpdateAction){
        var game = findGame(clientAction.gameId);
        if(!game){
            console.log('game introuvable');
            socket.emit('gameNotFound');
            return;
        }
        game.update(io, clientAction);
        if(game.gameState === GameStateEnum.GAME_OVER){
            //force les clients à se déconnecter/revenir au portail
            io.to(game.gameId).emit('gameNotFound');
            //La game est fini, on la supprime
            deleteGame(game.gameId);
        }
    });
    socket.on('deleteGame', function(clientAction){
        var game = findGame(clientAction.gameId);
        if(!game){
            console.log('game introuvable');
            socket.emit('gameNotFound');
            return;
        }
        else {
            console.log("on delete la game: " + game.gameId);
            deleteGame(game.gameId);
            console.log(util.inspect(games));
        }
    });
});

httpServer.listen(gameport, function(){
    console.log('listening on *:' + gameport);
});

function findGame(gameId: string){
    for(var i = 0; i < games.length; i++){
        if(games[i].gameId === gameId){
            return games[i];
        }
    }
    return undefined;
}

function deleteGame(gameId: string) {
    console.log("gameId: " + gameId);
    console.log("gamesLength: " + games.length);
    for (let i = games.length - 1; i >= 0; i-- ) {
        console.log(games[i].gameId); 
        if(games[i].gameId === gameId){
            console.log("on a trouvé la game, on la delete");
            games.splice(i, 1);
        }
    }
}

function makeUniqueId()
{
    var text = "";
    var possible = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

    do{
        var text = "";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    } while(findGame(text) !== undefined);

    return text;
}