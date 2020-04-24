function Player(){
    this.role;
    this.playerId;
    this.playerName;
    this.isLeader = false;
    this.nbMissionBleu = 0;
    this.nbMissionRouge = 0;
    //Pour savoir s'il a accepté son rôle au début de la game
    this.hasAcceptedRole = false;
    // Module Assassin: pour savoir qui est le commandant dans la resistance
    this.isCommander = false;
};
module.exports = Player;