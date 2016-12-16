function Mission(){
    this.currentRound = 0;
    this.currentTeam = [];//array de player
    this.result;
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

Mission.prototype.acceptTeam = function(player){
    addPlayerToArray(this.playerAccept, player);
}

Mission.prototype.rejectTeam = function(player){
    addPlayerToArray(this.playerReject, player);
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

Mission.prototype.isMissionComplete = function(nbTotalPlayers){
    return (this.playerVoteYes.length + this.playerVoteNo.length >= nbTotalPlayers);
}

Mission.prototype.getMissionResult = function(){
    this.result = (this.playerVoteNo.length >= this.nbFailRequired) ? "FAIL" : "SUCCESS";
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