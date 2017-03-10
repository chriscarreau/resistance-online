export var GameStateEnum = {
    NOT_STARTED : 0,
    DISTRIBUTE_ROLE : 1,
    TEAM_SELECTION : 2,
    VOTE : 3,
    VOTE_RESULT : 4,
    MISSION : 5,
    MISSION_RESULT : 6,
    GAME_OVER : 7
}

export var RoleEnum = {
    SPY : 0,
    RESISTANCE : 1
}

export var MissionResultEnum = {
    NO_RESULT : 0,
    SPY : 1,
    RESISTANCE : 2
}

export function IsPlayerInCurrentTeam(player, game){
    if(game.gameState === GameStateEnum.NOT_STARTED)
        return false;

    let team = game.missions[game.currentMission].currentTeam;
    for(var i = 0; i < team.length; i++){
        if(team[i].playerId === player.playerId){
            return true;
        }
    }
    return false;
}

export function GetCurrentJoueur(game){
    return GetPlayer(game, window.gameOptions.playerId);
}

export function IsPremierJoueur(game){
    if(game){
        return (game.firstPlayer.playerId == window.socket.id);
    }
    return false;
}

export function IsCurrentTeamComplete(game){
    if(game.gameState === GameStateEnum.NOT_STARTED)
        return false;

    let mission = game.missions[game.currentMission];
    return mission.currentTeam.length === mission.teamSize;
    //return mission.isCurrentTeamComplete() marche pas.... voir pourquoi
}

export function GetPlayer(game, playerId){
    for(let joueur of game.players){
        if(joueur.playerId === playerId){
            return joueur;
        }
    }
    return null;
}