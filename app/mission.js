const util = require('util');

var MissionResultEnum = {
    NO_RESULT : 0,
    SPY : 1,
    RESISTANCE : 2
}

function Mission(){
    this.currentRound = 0;
    this.currentTeam = [];//array de player
    this.result = MissionResultEnum.NO_RESULT;
    this.teamSize;
    this.playerAccept = [];
    this.playerReject = [];
    this.playerVoteSuccess = [];
    this.playerVoteFail = [];
    this.nbFailRequired = 1;
};

Mission.prototype.addPlayerToTeam = function(player){
    addPlayerToArray(this.currentTeam, player);
}

Mission.prototype.removePlayerFromTeam = function(playerId){
    for(var i = 0; i < this.currentTeam.length; i++){
        if(this.currentTeam[i].playerId === playerId){
            this.currentTeam.splice(i, 1);//delete element at i in array
            return;
        }
    }
}

Mission.prototype.isPlayerInTeam = function(playerId){
    for(var i = 0; i < this.currentTeam.length; i++){
        if(this.currentTeam[i].playerId === playerId){
            return true;
        }
    }
}

Mission.prototype.isCurrentTeamComplete = function(){
    return this.currentTeam.length === this.teamSize;
}

Mission.prototype.acceptTeam = function(player){
    addPlayerToArray(this.playerAccept, player);
}

Mission.prototype.rejectTeam = function(player){
    addPlayerToArray(this.playerReject, player);
}

Mission.prototype.cancelVote = function(player){
    console.log(util.inspect(this));
    for (let i = this.playerAccept.length - 1; i >= 0; i-- ) {
        console.log(util.inspect(this.playerAccept[i]));
        if(player.playerId === this.playerAccept[i].playerId){
            this.playerAccept.splice(i, 1);
        }
    }
    for (let i = this.playerReject.length - 1; i >= 0; i-- ) {
        console.log(util.inspect(this.playerAccept[i]));
        if(player.playerId === this.playerReject[i].playerId){
            this.playerReject.splice(i, 1);
        }
    }
}

Mission.prototype.hasEveryoneVoted = function(nbTotalPlayers){
    return (this.playerAccept.length + this.playerReject.length >= nbTotalPlayers);
}

Mission.prototype.isMissionAccepted = function(){
    return (this.playerAccept.length > this.playerReject.length);
}

Mission.prototype.voteRejected = function(){
    this.currentRound++;
    this.currentTeam = [];
    this.playerAccept = [];
    this.playerReject = [];
}

Mission.prototype.voteSuccess = function(player){
    addPlayerToArray(this.playerVoteSuccess, player);
}

Mission.prototype.voteFail = function(player){
    addPlayerToArray(this.playerVoteFail, player);
}

Mission.prototype.cancelMissionVote = function(player){
    console.log(util.inspect(this));
    for (let i = this.playerVoteSuccess.length - 1; i >= 0; i-- ) {
        if(player.playerId === this.playerVoteSuccess[i].playerId){
            this.playerVoteSuccess.splice(i, 1);
        }
    }
    for (let i = this.playerVoteFail.length - 1; i >= 0; i-- ) {
        if(player.playerId === this.playerVoteFail[i].playerId){
            this.playerVoteFail.splice(i, 1);
        }
    }
}

Mission.prototype.isMissionComplete = function(){
    return (this.playerVoteSuccess.length + this.playerVoteFail.length >= this.teamSize);
}

Mission.prototype.getMissionResult = function(){
    this.result = (this.playerVoteFail.length >= this.nbFailRequired) ? MissionResultEnum.SPY : MissionResultEnum.RESISTANCE;
    for(var i = 0; i < this.currentTeam.length; i++){
        if(this.result === MissionResultEnum.SPY){
            this.currentTeam[i].nbMissionRouge++;
        }
        else{
            this.currentTeam[i].nbMissionBleu++;
        }
    }
    return this.result;
}


module.exports = Mission;

function addPlayerToArray(array, player){
    for(var i = 0; i < array.length; i++){
        if(array[i].playerId === player.playerId){
            return;
        }
    }
    array.push(player);
}