//Code que l'on veut partager parmi tous les components

import { GameStateEnum } from "../shared/enums";
import { IGame } from "../shared/game.interface";
import { IPlayer } from "../shared/player.interface";


export function IsPlayerInCurrentTeam(player: IPlayer, game: IGame){
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

export function HasPlayerVoted(game: IGame, playerId: string): boolean {
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

export function GetCurrentJoueur(game: IGame): IPlayer {
    return GetPlayer(game, globalThis.gameOptions.playerId);
}

export function IsPremierJoueur(game: IGame): boolean {
    if(game){
        return (game.firstPlayer.playerId == globalThis.socket.id);
    }
    return false;
}

export function IsCurrentTeamComplete(game: IGame): boolean {
    if(game.gameState === GameStateEnum.NOT_STARTED)
        return false;

    let mission = game.missions[game.currentMission];
    return mission.currentTeam.length === mission.teamSize;
}

export function GetPlayer(game: IGame, playerId: string): IPlayer {
    for(let joueur of game.players){
        if(joueur.playerId === playerId){
            return joueur;
        }
    }
    return null;
}