var Mission = require('./mission.js');
var Player = require('./player.js');
var tools = require('./tools.js');
const util = require('util');

function Game(){
    this.init();
};

// Méthode principale qui sert à update le gameState
Game.prototype.update = function(io, clientAction){
    let currentMission = this.missions[this.currentMission];
    let player = this.getPlayer(clientAction.playerId);
    switch (this.gameState) {
        case tools.GameStateEnum.NOT_STARTED:
            if(clientAction.playerId === this.firstPlayer.playerId && clientAction.message === 'START_GAME'){
                this.gameState = tools.GameStateEnum.DISTRIBUTE_ROLE;
                this.startGame(io);
            }
            break;
        case tools.GameStateEnum.DISTRIBUTE_ROLE:
            if(clientAction.message === 'ACCEPT_ROLE'){
                let player = this.getPlayer(clientAction.playerId);
                this.acceptRole(player);
            }
            // On attends que tout le monde ait accepté son rôle
            if(this.hasEveryoneAcceptedRole()){
                this.players[this.getCurrentLeader()].isLeader = true;
                this.gameState = tools.GameStateEnum.TEAM_SELECTION;
            }
            break;
        case tools.GameStateEnum.TEAM_SELECTION:
            if(clientAction.message === 'ADD_REMOVE_PLAYER_TEAM'){
                if(currentMission.isPlayerInTeam(player.playerId)){
                    currentMission.removePlayerFromTeam(player.playerId);
                }
                else{
                    currentMission.addPlayerToTeam(player);
                }
            }
            else if (clientAction.message === 'SUBMIT_TEAM'){
                if(currentMission.currentTeam.length === currentMission.teamSize){
                    //si on est au dernier round, pas de vote
                    if(currentMission.currentRound === 4){
                        this.gameState = tools.GameStateEnum.MISSION;
                    }
                    else{
                        this.gameState = tools.GameStateEnum.VOTE;
                    }
                }
            }            
            break;
        case tools.GameStateEnum.VOTE:
            if (clientAction.message === 'CANCEL_MISSION') {
                currentMission.playerAccept = [];
                currentMission.playerReject = [];
                this.gameState = tools.GameStateEnum.TEAM_SELECTION;
                break;
            }
            else if (clientAction.message === 'CANCEL_VOTE'){
                currentMission.cancelVote(player);
            }
            else if(clientAction.message === 'VOTE_ACCEPT'){
                currentMission.acceptTeam(player);
            }
            else if(clientAction.message === 'VOTE_REJECT'){
                currentMission.rejectTeam(player);
            }
            //Si tout le monde a voté, on passe au résultat
            else if(clientAction.message === 'REVEAL_VOTE' && currentMission.hasEveryoneVoted(this.nbPlayersTotal)){
                this.gameState = tools.GameStateEnum.VOTE_RESULT;
            }
            break;
        case tools.GameStateEnum.VOTE_RESULT:
            //Ici y'a rien à faire côté serveur, on attend que le leader appuie sur "passer à la prochaine étape"
            if(clientAction.message === "NEXT_STEP"){
                // Accepté
                if (currentMission.isMissionAccepted()) {
                    this.gameState = tools.GameStateEnum.MISSION;
                }
                // Refusé
                else{
                    this.players[this.getCurrentLeader()].isLeader = false;
                    currentMission.voteRejected();
                    console.log("currentLeader = " + this.getCurrentLeader());
                    this.players[this.getCurrentLeader()].isLeader = true;
                    this.gameState = tools.GameStateEnum.TEAM_SELECTION;
                }
            }
            break;
        case tools.GameStateEnum.MISSION:
            if (clientAction.message === 'CANCEL_MISSION') {
                this.players[this.getCurrentLeader()].isLeader = false;
                currentMission.voteRejected();
                this.players[this.getCurrentLeader()].isLeader = true;
                this.gameState = tools.GameStateEnum.TEAM_SELECTION;
                break;
            }
            else if (clientAction.message === 'CANCEL_VOTE'){
                currentMission.cancelMissionVote(player);
            }
            else if(clientAction.message === 'VOTE_SUCCESS'){
                currentMission.voteSuccess(player);
            }
            else if(clientAction.message === 'VOTE_FAIL'){
                currentMission.voteFail(player);
            }
            else if(clientAction.message === 'REVEAL_MISSION' && currentMission.isMissionComplete(this.nbPlayersTotal)){
                this.missions[this.currentMission].getMissionResult();
                this.gameState = tools.GameStateEnum.MISSION_RESULT;
            }
            break;
        case tools.GameStateEnum.MISSION_RESULT:
            //Ici y'a rien à faire côté serveur, on attend que le leader appuie sur "passer à la prochaine étape"
            if(clientAction.message === "NEXT_STEP"){
                if(this.hasATeamWon()){
                    this.gameState = tools.GameStateEnum.GAME_OVER;
                }
                else{
                    this.players[this.getCurrentLeader()].isLeader = false;
                    this.startNewMission();
                    this.players[this.getCurrentLeader()].isLeader = true;
                    this.gameState = tools.GameStateEnum.TEAM_SELECTION;
                }
            }
            break;
        case tools.GameStateEnum.GAME_OVER:
            this.init();
            break;
    
        default:
            break;
    }
    //console.log(util.inspect(this));
    io.to(this.gameId).emit('gameUpdate', this);
}
Game.prototype.init = function(){
    this.gameId;
    this.firstPlayer = {};
    this.players = [];
    this.nbPlayersTotal = 0;
    this.teamSizes = [];
    this.hostId;
    this.spy = [];
    this.resistance = [];
    this.missions = [];
    this.currentMission = 0;
    this.firstLeader = 0;
    this.lastLeader = 0;
    this.playerRoleAccepte = [];
    this.gameState = tools.GameStateEnum.NOT_STARTED;
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
    this.lastLeader = (this.firstLeader + 4) % this.nbPlayersTotal;
    //On remplis un tableau dans l'objet Game contenant la grosseur des équipes pour chaque mission, maintenant que tous les joueurs sont présents
    for (var i = 0; i < tools.arrayTeamSize.length; i++) {
        this.teamSizes.push(tools.arrayTeamSize[i][this.nbPlayersTotal-5]);
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
        joueur.role = tools.RoleEnum.SPY;
        io.to(joueur.playerId).emit('role', 'Ton rôle est: Espion' );
    }
    for(var joueur of this.resistance){
        // TODO: Option de désactiver le module Assassin
        joueur.role = tools.RoleEnum.RESISTANCE;
        const commandantRole = joueur.isCommander ? ' (Commandant)' : '';
        io.to(joueur.playerId).emit('role', 'Ton rôle est: Resistance' + commandantRole );
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
    
    this.assignCommander();
}

Game.prototype.assignCommander = function() {
    // first player in the resistance is the commander
    const player = this.resistance[0];
    player.isCommander = true;
}

Game.prototype.acceptRole = function(player){
    addPlayerToArray(this.playerRoleAccepte, player);
    player.hasAcceptedRole = true;
}

Game.prototype.hasEveryoneAcceptedRole = function(){
    return this.playerRoleAccepte.length == this.nbPlayersTotal;
}

Game.prototype.startNewMission = function(){
    this.firstLeader = (this.getCurrentLeader() + 1) % this.nbPlayersTotal;
    this.lastLeader = (this.firstLeader + 4) % this.nbPlayersTotal;
    this.currentMission++;
}
Game.prototype.getCurrentLeader = function(){
    return (this.firstLeader + this.missions[this.currentMission].currentRound) % this.nbPlayersTotal;
}

Game.prototype.hasATeamWon = function(){
    let scoreResistance = 0, scoreSpy = 0;
    for(let i = 0; i < this.missions.length; i++){
        if(this.missions[i].result === tools.MissionResultEnum.RESISTANCE){
            scoreResistance++;
        }
        else if(this.missions[i].result === tools.MissionResultEnum.SPY){
            scoreSpy++;
        }
    }
    return (scoreSpy >= 3 || scoreResistance >= 3);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex, tempArray;
  tempArray = Array.from(array);

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = tempArray[currentIndex];
    tempArray[currentIndex] = tempArray[randomIndex];
    tempArray[randomIndex] = temporaryValue;
  }

  return tempArray;
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