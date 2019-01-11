//Code que l'on veut partager parmi tous les components

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

export function HasPlayerVoted(game, playerId){
    if (game.missions.length > 0 && game.playerRoleAccepte.length > 0){
        let mission = game.missions[game.currentMission];
        switch (game.gameState){
            case GameStateEnum.DISTRIBUTE_ROLE:
                for(let i = 0; i < game.playerRoleAccepte.length; i++){
                    if(game.playerRoleAccepte[i].playerId === playerId){
                        return true;
                    }
                }
                break;
            case GameStateEnum.VOTE:
                for(let i = 0; i < mission.playerAccept.length; i++){
                    if(mission.playerAccept[i].playerId === playerId){
                        return true;
                    }
                }
                for(let i = 0; i < mission.playerReject.length; i++){
                    if(mission.playerReject[i].playerId === playerId){
                        return false;
                    }
                }
                break;
            case GameStateEnum.MISSION:
                for(let i = 0; i < mission.playerVoteSuccess.length; i++){
                    if(mission.playerVoteSuccess[i].playerId === playerId){
                        return true;
                    }
                }
                for(let i = 0; i < mission.playerVoteFail.length; i++){
                    if(mission.playerVoteFail[i].playerId === playerId){
                        return false;
                    }
                }
                break;
        }
    }
    return null;
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