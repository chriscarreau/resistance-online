var Mission = require('./mission.js');

var arrayTeamSize = [
    [2,2,2,3,3,3],
    [3,3,3,4,4,4],
    [2,4,3,4,4,4],
    [3,3,4,5,5,5],
    [3,4,4,5,5,5],
]

function Game(){
    this.isStarted = false;
    this.gameId;
    this.players = [];
    this.spy = [];
    this.resistance = [];
    this.missions = [];
    this.currentMission = 0;
    this.firstLeader = 0;
    this.lastLeader = 0;
    this.nbPlayersTotal = 0;
    this.playerRoleAccepte = [];
    this.hostId;
};
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

Game.prototype.startGame = function(){
    this.isStarted = true;
    this.nbPlayersTotal = this.players.length;
    this.firstLeader = Math.floor(Math.random()*this.nbPlayersTotal);
    this.lastLeader = (this.firstLeader + 5) % this.nbPlayersTotal;
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
    var teamsize = arrayTeamSize[this.currentMission][this.nbPlayersTotal-5];
    var nbFailRequired = 1;
    if(this.currentMission == 3 && this.nbPlayersTotal > 6){
        nbFailRequired = 2;
    }
    var mission = new Mission();
    mission.teamSize = teamsize;
    mission.nbFailRequired = nbFailRequired;
    if(this.currentMission !== 0){
        this.firstLeader = this.getCurrentLeader() + 1;
        this.lastLeader = (this.firstLeader + 5) % this.nbPlayersTotal;
    }
    this.missions.push(mission);
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