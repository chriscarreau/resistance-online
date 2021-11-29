
import { Player } from "./player";
import { Mission } from "./mission";
import { Server } from "socket.io";
import { ActionEnum, arrayTeamSize, ClientUpdateAction, GameStateEnum, MissionResultEnum, RoleEnum } from "./tools";
const util = require('util');

export class Game {
    gameId: string;
    firstPlayer?: Player = undefined;
    players: Player[] = [];
    spy: Player[] = [];
    resistance: Player[] = [];
    missions: Mission[] = [];
    currentMission: number = 0;
    firstLeader: number = 0;
    lastLeader: number = 0;
    nbPlayersTotal = 0;
    playerRoleAccepte: Player[] = [];
    teamSizes: number[] = [];
    hostId: string;
    gameState: GameStateEnum = GameStateEnum.NOT_STARTED;

    constructor(gameId: string, hostId: string) {
        this.gameId = gameId;
        this.hostId = hostId;
    }

    // Méthode principale qui sert à update le gameState
    update(io: Server, clientAction: ClientUpdateAction) {
        let currentMission = this.missions[this.currentMission];
        const player = this.getPlayer(clientAction.playerId);
        if (!player) {
            return;
        }
        switch (this.gameState) {
            case GameStateEnum.NOT_STARTED:
                if (clientAction.playerId === this.firstPlayer?.playerId && clientAction.action === ActionEnum.START_GAME) {
                    this.gameState = GameStateEnum.DISTRIBUTE_ROLE;
                    this.startGame(io);
                }
                break;
            case GameStateEnum.DISTRIBUTE_ROLE:
                if (clientAction.action === ActionEnum.ACCEPT_ROLE) {
                    this.acceptRole(player);
                }
                // On attends que tout le monde ait accepté son rôle
                if (this.hasEveryoneAcceptedRole()) {
                    this.players[this.getCurrentLeader()].isLeader = true;
                    this.gameState = GameStateEnum.TEAM_SELECTION;
                }
                break;
            case GameStateEnum.TEAM_SELECTION:
                if (clientAction.action === ActionEnum.ADD_REMOVE_PLAYER_TEAM) {
                    if (currentMission.isPlayerInTeam(player.playerId)) {
                        currentMission.removePlayerFromTeam(player.playerId);
                    }
                    else {
                        currentMission.addPlayerToTeam(player);
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (currentMission.currentTeam.length === currentMission.teamSize) {
                        //si on est au dernier round, pas de vote
                        if (currentMission.currentRound === 4) {
                            this.gameState = GameStateEnum.MISSION;
                        }
                        else {
                            this.gameState = GameStateEnum.VOTE;
                        }
                    }
                }
                break;
            case GameStateEnum.VOTE:
                if (clientAction.action === ActionEnum.CANCEL_MISSION) {
                    currentMission.playerAccept = [];
                    currentMission.playerReject = [];
                    this.gameState = GameStateEnum.TEAM_SELECTION;
                    break;
                }
                else if (clientAction.action === ActionEnum.CANCEL_VOTE) {
                    currentMission.cancelVote(player);
                }
                else if (clientAction.action === ActionEnum.VOTE_ACCEPT) {
                    currentMission.acceptTeam(player);
                }
                else if (clientAction.action === ActionEnum.VOTE_REJECT) {
                    currentMission.rejectTeam(player);
                }
                //Si tout le monde a voté, on passe au résultat
                else if (clientAction.action === ActionEnum.REVEAL_VOTE && currentMission.hasEveryoneVoted(this.nbPlayersTotal)) {
                    this.gameState = GameStateEnum.VOTE_RESULT;
                }
                break;
            case GameStateEnum.VOTE_RESULT:
                //Ici y'a rien à faire côté serveur, on attend que le leader appuie sur "passer à la prochaine étape"
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    // Accepté
                    if (currentMission.isMissionAccepted()) {
                        this.gameState = GameStateEnum.MISSION;
                    }
                    // Refusé
                    else {
                        this.players[this.getCurrentLeader()].isLeader = false;
                        currentMission.voteRejected();
                        console.log("currentLeader = " + this.getCurrentLeader());
                        this.players[this.getCurrentLeader()].isLeader = true;
                        this.gameState = GameStateEnum.TEAM_SELECTION;
                    }
                }
                break;
            case GameStateEnum.MISSION:
                if (clientAction.action === ActionEnum.CANCEL_MISSION) {
                    this.players[this.getCurrentLeader()].isLeader = false;
                    currentMission.voteRejected();
                    this.players[this.getCurrentLeader()].isLeader = true;
                    this.gameState = GameStateEnum.TEAM_SELECTION;
                    break;
                }
                else if (clientAction.action === ActionEnum.CANCEL_VOTE) {
                    currentMission.cancelMissionVote(player);
                }
                else if (clientAction.action === ActionEnum.VOTE_SUCCESS) {
                    currentMission.voteSuccess(player);
                }
                else if (clientAction.action === ActionEnum.VOTE_FAIL) {
                    currentMission.voteFail(player);
                }
                else if (clientAction.action === ActionEnum.REVEAL_MISSION && currentMission.isMissionComplete()) {
                    this.missions[this.currentMission].getMissionResult();
                    this.gameState = GameStateEnum.MISSION_RESULT;
                }
                break;
            case GameStateEnum.MISSION_RESULT:
                //Ici y'a rien à faire côté serveur, on attend que le leader appuie sur "passer à la prochaine étape"
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    if (this.hasATeamWon()) {
                        this.gameState = GameStateEnum.GAME_OVER;
                    }
                    else {
                        this.players[this.getCurrentLeader()].isLeader = false;
                        this.startNewMission();
                        this.players[this.getCurrentLeader()].isLeader = true;
                        this.gameState = GameStateEnum.TEAM_SELECTION;
                    }
                }
                break;
            case GameStateEnum.GAME_OVER:
                this.resetGame();
                break;

            default:
                break;
        }
        io.to(this.gameId).emit('gameUpdate', this);
    }
    resetGame() {
        this.spy = [];
        this.resistance = [];
        this.missions = [];
        this.currentMission = 0;
        this.firstLeader = 0;
        this.lastLeader = 0;
        this.playerRoleAccepte = [];
        this.gameState = GameStateEnum.NOT_STARTED;
        //TODO: Reset players (genre isLeader, hasAcceptedRole)
    }

    getPlayer(playerId: string) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].playerId === playerId) {
                return this.players[i];
            }
        }
        return undefined;
    }

    addPlayer(player: Player) {
         this.addPlayerToArray(this.players, player);
    }

    removePlayer(playerId: string) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].playerId === playerId) {
                this.players.splice(i, 1);//delete element at i in array
                return;
            }
        }
    }

    startGame(io: Server) {
        this.nbPlayersTotal = this.players.length;
        this.firstLeader = Math.floor(Math.random() * this.nbPlayersTotal);
        this.lastLeader = (this.firstLeader + 4) % this.nbPlayersTotal;
        //On remplis un tableau dans l'objet Game contenant la grosseur des équipes pour chaque mission, maintenant que tous les joueurs sont présents
        for (var i = 0; i < arrayTeamSize.length; i++) {
            this.teamSizes.push(arrayTeamSize[i][this.nbPlayersTotal - 5]);
        }

        for (let i = 0; i < 5; i++) {
            let mission = new Mission();
            let nbFailRequired = 1;
            if (i == 3 && this.nbPlayersTotal > 6) {
                nbFailRequired = 2;
            }
            mission.teamSize = this.teamSizes[i];
            mission.nbFailRequired = nbFailRequired;
            this.missions.push(mission);
        }
        //assigne les rôles
        this.assignRoles();

        //envoie un message a tous les joueurs avec leurs rôles
        for (var joueur of this.spy) {
            joueur.role = RoleEnum.SPY;
            io.to(joueur.playerId).emit('role', 'ton rôle est: espion');
        }
        for (var joueur of this.resistance) {
            joueur.role = RoleEnum.RESISTANCE;
            io.to(joueur.playerId).emit('role', 'ton rôle est: resistance');
        }
        io.to(this.gameId).emit('gameUpdate', this);
    }

    assignRoles() {
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

        var shuffledArray = this.shuffle(this.players);

        for (var i = 0; i < this.players.length; i++) {
            if (i < nbSpy) {
                this.spy.push(shuffledArray[i]);
            }
            else {
                this.resistance.push(shuffledArray[i]);
            }
        }
    }

    acceptRole(player: Player) {
         this.addPlayerToArray(this.playerRoleAccepte, player);
        player.hasAcceptedRole = true;
    }

    hasEveryoneAcceptedRole() {
        return this.playerRoleAccepte.length == this.nbPlayersTotal;
    }

    startNewMission() {
        this.firstLeader = (this.getCurrentLeader() + 1) % this.nbPlayersTotal;
        this.lastLeader = (this.firstLeader + 4) % this.nbPlayersTotal;
        this.currentMission++;
    }
    getCurrentLeader() {
        return (this.firstLeader + this.missions[this.currentMission].currentRound) % this.nbPlayersTotal;
    }

    hasATeamWon() {
        let scoreResistance = 0, scoreSpy = 0;
        for (let i = 0; i < this.missions.length; i++) {
            if (this.missions[i].result === MissionResultEnum.RESISTANCE) {
                scoreResistance++;
            }
            else if (this.missions[i].result === MissionResultEnum.SPY) {
                scoreSpy++;
            }
        }
        return (scoreSpy >= 3 || scoreResistance >= 3);
    }

    private shuffle(array: Player[]) {
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
    private addPlayerToArray(array: Player[], player: Player) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].playerId === player.playerId) {
                return;
            }
        }
        array.push(player);
    }
};