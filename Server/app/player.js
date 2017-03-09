function Player(){
    this.role;
    this.playerId;
    this.playerName;
    this.isLeader = false;
    this.nbMissionBleu = 0;
    this.nbMissionRouge = 0;
    this.hasAcceptedRole = false;
};
module.exports = Player;