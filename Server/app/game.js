var Mission = require('./mission.js');
var Player = require('./player.js');

var arrayTeamSize = [
    [2,2,2,3,3,3],
    [3,3,3,4,4,4],
    [2,4,3,4,4,4],
    [3,3,4,5,5,5],
    [3,4,4,5,5,5],
]

var RoleEnum = {
    SPY : 0,
    RESISTANCE : 1
}

var GameStateEnum = {
    NOT_STARTED : 0,
    DISTRIBUTE_ROLE : 1,
    TEAM_SELECTION : 2,
    VOTE : 3,
    VOTE_RESULT : 4,
    MISSION : 5,
    MISSION_RESULT : 6,
    GAME_OVER : 7
}

function Game(){
    this.gameId;
    this.firstPlayer = {};
    this.players = [];
    this.spy = [];
    this.resistance = [];
    this.missions = [];
    this.currentMission = 0;
    this.firstLeader = 0;
    this.lastLeader = 0;
    this.nbPlayersTotal = 0;
    this.playerRoleAccepte = [];
    this.teamSizes = [];
    this.hostId;
    this.gameState = GameStateEnum.NOT_STARTED;
};

Game.prototype.update = function(io, clientAction){
    switch (this.gameState) {
        case GameStateEnum.NOT_STARTED:
            if(clientAction.playerId === this.firstPlayer.playerId && clientAction.message === 'START_GAME'){
                this.gameState = GameStateEnum.DISTRIBUTE_ROLE;
                this.startGame(io);
            }
            break;
        case GameStateEnum.DISTRIBUTE_ROLE:
            if(clientAction.message === 'ACCEPT_ROLE'){
                let player = this.getPlayer(clientAction.playerId);
                this.acceptRole(player);
            }
            // On attends que tout le monde ait accepté son rôle
            if(this.hasEveryoneAcceptedRole()){
                this.gameState = GameStateEnum.TEAM_SELECTION;
            }
            break;
        case GameStateEnum.TEAM_SELECTION:
            //TO DO: quand le leader appuie sur un joueur, updater visuellement la liste sur l'host
            // et quand le leader appuie sur 'soumettre', finaliser son choix et changer d'état
            
            break;
        case GameStateEnum.VOTE:
            //Si tout le monde a voté, on passe au résultat
            if(this.missions[this.currentMission].hasEveryoneVoted()){
                this.gameState = GameStateEnum.VOTE_RESULT;
            }
            break;
        case GameStateEnum.VOTE_RESULT:
            //Ici y'a rien à faire côté serveur, on attend que le leader appuie sur "passer à la prochaine mission"
            if(clientAction.message === "NEXT_STEP"){
                // Accepté
                if (this.missions[this.currentMission].isMissionAccepted) {
                    this.gameState = GameStateEnum.MISSION;
                }
                // Refusé
                else{
                    this.gameState = GameStateEnum.TEAM_SELECTION;
                }
            }
            break;
        case GameStateEnum.MISSION:
            if(this.missions[this.currentMission].isMissionComplete()){
                this.missions[this.currentMission].getMissionResult();
                this.gameState = GameStateEnum.MISSION_RESULT;
            }
            break;
        case GameStateEnum.MISSION_RESULT:
            
            break;
        case GameStateEnum.GAME_OVER:
            this.resetGame();
            break;
    
        default:
            break;
    }
    io.to(this.hostId).emit('gameUpdate', this);
}
Game.prototype.resetGame = function(){
    this.spy = [];
    this.resistance = [];
    this.missions = [];
    this.currentMission = 0;
    this.firstLeader = 0;
    this.lastLeader = 0;
    this.playerRoleAccepte = [];
    this.gameState = GameStateEnum.NOT_STARTED;
}

Game.prototype.getPlayer = function(playerId){
    for(var i = 0; i < this.players.length; i++){
        if(this.players[i].playerId === playerId){
            return this.players[i];
        }
    }
    return null;
}

Game.prototype.addPlayer = function(player){
    addPlayerToArray(this.players, player);
}

Game.prototype.removePlayer = function(playerId){
    for(var i = 0; i < this.players.length; i++){
        if(this.players[i].playerId === playerId){
            this.players.splice(i, 1);//delete element at i in array
            return;
        }
    }
}

Game.prototype.startGame = function(io){
    this.nbPlayersTotal = this.players.length;
    this.firstLeader = Math.floor(Math.random()*this.nbPlayersTotal);
    this.lastLeader = (this.firstLeader + 5) % this.nbPlayersTotal;
    //On remplis un tableau dans l'objet Game contenant la grosseur des équipes pour chaque mission, maintenant que tous les joueurs sont présents
    for (var i = 0; i < arrayTeamSize.length; i++) {
        this.teamSizes.push(arrayTeamSize[i][this.nbPlayersTotal-5]);
    }

    for(let i = 0; i < 5; i++){
        let mission = new Mission();
        let nbFailRequired = 1;
        if(i == 3 && this.nbPlayersTotal > 6){
            nbFailRequired = 2;
        }
        mission.teamSize = this.teamSizes[i];
        mission.nbFailRequired = nbFailRequired;
        this.missions.push(mission);
    }
    //assigne les rôles
    this.assignRoles();

    //envoie un message a tous les joueurs avec leurs rôles
    for(var joueur of this.spy){
        joueur.role = RoleEnum.SPY;
        io.to(joueur.playerId).emit('role', 'ton rôle est: espion' );
    }
    for(var joueur of this.resistance){
        joueur.role = RoleEnum.RESISTANCE;
        io.to(joueur.playerId).emit('role', 'ton rôle est: resistance' );
    }
    io.to(this.gameId).emit('gameUpdate', this);
}

Game.prototype.assignRoles = function(){
    var nbSpy = 0;
    switch (this.nbPlayersTotal) {
        case 5:
        case 6:
            nbSpy = 2;
            break;
        case 7:
        case 8:
        case 9:
            nbSpy = 3;
            break;
        case 10:
            nbSpy = 4;
            break;
    }
    
    var shuffledArray = shuffle(this.players);
    
    for(var i = 0; i < this.players.length; i++){
        if(i < nbSpy){
            this.spy.push(shuffledArray[i]);
        }
        else{
            this.resistance.push(shuffledArray[i]);
        }
    }
}

Game.prototype.acceptRole = function(player){
    addPlayerToArray(this.playerRoleAccepte, player);
}

Game.prototype.hasEveryoneAcceptedRole = function(){
    return this.playerRoleAccepte.length == this.nbPlayersTotal;
}

Game.prototype.startNewMission = function(){
    var mission = this.missions[this.currentMission]
    if(this.currentMission !== 0){
        this.firstLeader = (this.getCurrentLeader() + 1) % this.nbPlayersTotal;
        this.lastLeader = (this.firstLeader + 5) % this.nbPlayersTotal;
    }
    this.currentMission++;
}
Game.prototype.getCurrentLeader = function(){
    return this.firstLeader + this.missions[this.currentMission - 1].currentRound;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = Game;


function addPlayerToArray(array, player){
    for(var i = 0; i < array.length; i++){
        if(array[i].playerId === player.playerId){
            return;
        }
    }
    array.push(player);
}