
import { Player } from "./player";
import { Mission } from "./mission";
import { Server } from "socket.io";
import { IPower, PowerTypeEnum } from "../shared/power.interface";
import { ActionEnum, GameStateEnum, MissionResultEnum, RoleEnum } from "../shared/enums";
import { getSmallPowerPool, getLargePowerPool, arrayTeamSize } from "../shared/constants";
import { ClientUpdateAction } from "../shared/client-update-action.interface";
import { IPlayer } from "../shared/player.interface";
import { IMission } from "../shared/mission.interface";
import { IGame } from "../shared/game.interface";
const util = require('util');

export class Game implements IGame {
    gameId: string;
    firstPlayer?: IPlayer = undefined;
    players: IPlayer[] = [];
    spy: IPlayer[] = [];
    resistance: IPlayer[] = [];
    missions: IMission[] = [];
    currentMission: number = 0;
    firstLeader: number = 0;
    lastLeader: number = 0;
    nbPlayersTotal = 0;
    playerRoleAccepte: Player[] = [];
    teamSizes: number[] = [];
    hostId: string;
    powerPool: IPower[] = [];
    drawnPower?: IPower;
    temporaryLeader?: number;
    powerSelectionPlayers: IPlayer[] = [];
    playerSelectedForPower?: IPlayer;
    powerStealingSelection: {player: IPlayer, powerType: PowerTypeEnum}[] = [];
    playerUsingPower?: IPlayer;
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
                    this.drawnPower = this.drawRandomPower();
                    this.players[this.getCurrentLeader()].isLeader = true;
                    this.gameState = GameStateEnum.DRAW_POWER;
                }
                break;
            case GameStateEnum.STRONG_LEADER:
                if (clientAction.action === ActionEnum.USE_POWER) {
                    // Change leader to the player who stole the mission
                    this.temporaryLeader = this.players.findIndex(player => player.playerId === clientAction.playerId);
                    this.removePowerFromPlayer(PowerTypeEnum.StrongLeader, player);
                    this.players[this.getCurrentLeader()].isLeader = true;
                    if (this.missions[this.currentMission].currentRound === 0) {
                        // First mission round, therefore we need to draw power
                        this.drawnPower = this.drawRandomPower();
                        this.gameState = GameStateEnum.DRAW_POWER;
                    }
                    else {
                        // Not first round, we just go to the team selection
                        this.gameState = GameStateEnum.TEAM_SELECTION;
                    }
                }
                else if (clientAction.action === ActionEnum.NEXT_STEP) {
                    this.players[this.getCurrentLeader()].isLeader = true;
                    if (this.missions[this.currentMission].currentRound === 0) {
                        // First mission round, therefore we need to draw power
                        this.drawnPower = this.drawRandomPower();
                        this.gameState = GameStateEnum.DRAW_POWER;
                    }
                    else {
                        // Not first round, we just go to the team selection
                        this.gameState = GameStateEnum.TEAM_SELECTION;
                    }
                }
                break;

            case GameStateEnum.DRAW_POWER:
                // We are only waiting for the leader to continue, after seeing the power drawn
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    if (this.drawnPower?.type === PowerTypeEnum.EstablishConfidence) {
                        this.gameState = GameStateEnum.ESTABLISH_CONFIDENCE_SELECT;
                    }
                    else if (this.drawnPower?.type === PowerTypeEnum.TakeResponsability && this.players.every(p => p.powers.length === 0)) {
                        // If the power was "steal a power", but no one has any powers then let's just skip the whole give power phase
                        this.gameState = GameStateEnum.TEAM_SELECTION;
                    }
                    else {
                        this.gameState = GameStateEnum.GIVE_POWER;
                    }
                }
                break;
            case GameStateEnum.GIVE_POWER:
                // Leader selects who he's going to give the power to
                if (clientAction.action === ActionEnum.ADD_REMOVE_PLAYER_TEAM) {
                    const index = this.powerSelectionPlayers.findIndex(player => player.playerId === clientAction.playerId);
                    if (index !== -1) {
                        this.powerSelectionPlayers.splice(index, 1);
                    }
                    else {
                        this.powerSelectionPlayers.push(player);
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (this.powerSelectionPlayers.length === 1) {
                        this.givePowerToPlayer(this.powerSelectionPlayers[0]);
                        this.powerSelectionPlayers = [];

                        if (this.drawnPower?.type === PowerTypeEnum.OverheardConversation) {
                            this.gameState = GameStateEnum.OVERHEARD_CONVERSATION_SELECT;
                        }
                        else if (this.drawnPower?.type === PowerTypeEnum.OpenUp) {
                            this.gameState = GameStateEnum.OPEN_UP_SELECT;
                        }
                        else if (this.drawnPower?.type === PowerTypeEnum.TakeResponsability) {
                            if (this.players.some(p => p.powers.length > 0)) {
                                this.gameState = GameStateEnum.TAKE_RESPONSABILITY_SELECT;
                            }
                            else {
                                this.removePowerFromAllPlayer(PowerTypeEnum.TakeResponsability);
                                this.gameState = GameStateEnum.TEAM_SELECTION;
                            }
                        }
                        else {
                            this.gameState = GameStateEnum.TEAM_SELECTION;
                        }
                        this.drawnPower = undefined;
                    }
                }
                break;
            case GameStateEnum.TAKE_RESPONSABILITY_SELECT:
                // Player chose who to steal power from
                if (clientAction.action === ActionEnum.ADD_REMOVE_POWER_STEAL) {
                    const selectedPlayer = this.players.find(p => p.playerId === clientAction.selectedPlayerId);
                    if (!selectedPlayer || !clientAction.selectedPowerType){
                        return;
                    }
                    const index = this.powerStealingSelection?.findIndex(kv => kv.player.playerId === clientAction.selectedPlayerId && kv.powerType === clientAction.selectedPowerType);
                    if (index !== -1) {
                        this.powerStealingSelection.splice(index, 1);
                    }
                    else {
                        this.powerStealingSelection.push({player: selectedPlayer, powerType: clientAction.selectedPowerType});
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (this.powerStealingSelection.length === 1) {
                        const selectedPlayer = this.players.find(p => p.playerId === this.powerStealingSelection[0].player.playerId)
                        if (selectedPlayer) {
                            const powerIndex = selectedPlayer.powers.findIndex(p => p.type === this.powerStealingSelection[0].powerType)
                            player.powers.push(selectedPlayer.powers.splice(powerIndex, 1)[0])
                            this.removePowerFromAllPlayer(PowerTypeEnum.TakeResponsability);
                            this.powerStealingSelection = [];
                            this.gameState = GameStateEnum.TEAM_SELECTION;
                        }
                    }
                }
                break;
            case GameStateEnum.ESTABLISH_CONFIDENCE_SELECT:
                // Leader selects who he's going to show his role to
                if (clientAction.action === ActionEnum.ADD_REMOVE_PLAYER_TEAM) {
                    const index = this.powerSelectionPlayers.findIndex(player => player.playerId === clientAction.playerId);
                    if (index !== -1) {
                        this.powerSelectionPlayers.splice(index, 1);
                    }
                    else {
                        this.powerSelectionPlayers.push(player);
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (this.powerSelectionPlayers.length === 1) {
                        this.playerSelectedForPower = this.powerSelectionPlayers[0];
                        this.powerSelectionPlayers = [];
                        this.gameState = GameStateEnum.ESTABLISH_CONFIDENCE_REVEAL;
                    }
                }
                break;
            case GameStateEnum.ESTABLISH_CONFIDENCE_REVEAL:
                // We are only waiting for the person to acknowledge he saw the role of the other player
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    this.removePowerFromAllPlayer(PowerTypeEnum.EstablishConfidence);
                    this.playerSelectedForPower = undefined;
                    this.gameState = GameStateEnum.TEAM_SELECTION;
                }
                break;
            case GameStateEnum.OVERHEARD_CONVERSATION_SELECT:
                // Player selects who he's going to show his role to
                if (clientAction.action === ActionEnum.ADD_REMOVE_PLAYER_TEAM) {
                    const index = this.powerSelectionPlayers.findIndex(player => player.playerId === clientAction.playerId);
                    if (index !== -1) {
                        this.powerSelectionPlayers.splice(index, 1);
                    }
                    else {
                        this.powerSelectionPlayers.push(player);
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (this.powerSelectionPlayers.length === 1) {
                        this.playerSelectedForPower = this.powerSelectionPlayers[0];
                        this.powerSelectionPlayers = [];
                        this.gameState = GameStateEnum.OVERHEARD_CONVERSATION_REVEAL;
                    }
                }
                break;
            case GameStateEnum.OVERHEARD_CONVERSATION_REVEAL:
                // We are only waiting for the person to acknowledge he saw the role of the other player
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    this.removePowerFromAllPlayer(PowerTypeEnum.OverheardConversation);
                    this.playerSelectedForPower = undefined;
                    this.gameState = GameStateEnum.TEAM_SELECTION;
                }
                break;
            case GameStateEnum.OPEN_UP_SELECT:
                // Player selects who he's going to show his role to
                if (clientAction.action === ActionEnum.ADD_REMOVE_PLAYER_TEAM) {
                    const index = this.powerSelectionPlayers.findIndex(player => player.playerId === clientAction.playerId);
                    if (index !== -1) {
                        this.powerSelectionPlayers.splice(index, 1);
                    }
                    else {
                        this.powerSelectionPlayers.push(player);
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (this.powerSelectionPlayers.length === 1) {
                        this.playerSelectedForPower = this.powerSelectionPlayers[0];
                        this.powerSelectionPlayers = [];
                        this.gameState = GameStateEnum.OPEN_UP_REVEAL;
                    }
                }
                break;
            case GameStateEnum.OPEN_UP_REVEAL:
                // We are only waiting for the person to acknowledge he saw the role of the other player
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    this.removePowerFromAllPlayer(PowerTypeEnum.OpenUp);
                    this.playerSelectedForPower = undefined;
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
                            if (this.anyPlayerHasPower(PowerTypeEnum.OpinionMaker)) {
                                this.gameState = GameStateEnum.OPINION_MAKER_VOTE;
                            }
                            else {
                                this.gameState = GameStateEnum.VOTE;
                            }
                        }
                    }
                }
                break;
            case GameStateEnum.OPINION_MAKER_VOTE:
                if (clientAction.action === ActionEnum.CANCEL_MISSION) {
                    currentMission.playerAccept = [];
                    currentMission.playerReject = [];
                    this.gameState = GameStateEnum.TEAM_SELECTION;
                    break;
                }
                else if (clientAction.action === ActionEnum.VOTE_ACCEPT) {
                    currentMission.acceptTeam(player);
                }
                else if (clientAction.action === ActionEnum.VOTE_REJECT) {
                    currentMission.rejectTeam(player);
                }
                const playerWhoVoted = currentMission.playerAccept.concat(currentMission.playerReject);
                const playerWithOpinionMaker = this.players.filter(p => p.powers.some(p => p.type === PowerTypeEnum.OpinionMaker))
                // check if everyone who has the opinion maker power has voted before continuing
                if (playerWithOpinionMaker.every(p => playerWhoVoted.some(pl => pl.playerId === p.playerId))) {
                    this.gameState = GameStateEnum.VOTE;
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
                // Ici y'a rien à faire côté serveur, on attend que le leader appuie sur "passer à la prochaine étape"
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    // Accepté
                    if (currentMission.isMissionAccepted()) {
                        if (this.anyPlayerHasPower(PowerTypeEnum.NoConfidence)) {
                            this.gameState = GameStateEnum.NO_CONFIDENCE_CHOICE;
                        }
                        else {
                            if (this.anyPlayerHasPower(PowerTypeEnum.Spotlight)) {
                                this.gameState = GameStateEnum.SPOTLIGHT_CHOICE;
                            }
                            else {
                                this.gameState = GameStateEnum.MISSION;
                            }
                        }
                    }
                    // Refusé
                    else {
                        this.goToNextRound(currentMission);
                    }
                }
                break;

            case GameStateEnum.NO_CONFIDENCE_CHOICE:
                if (clientAction.action === ActionEnum.USE_POWER) {
                    this.removePowerFromPlayer(PowerTypeEnum.NoConfidence, player);
                    this.goToNextRound(currentMission);
                    break;
                }
                else if (clientAction.action === ActionEnum.NEXT_STEP) {
                    if (this.anyPlayerHasPower(PowerTypeEnum.Spotlight)) {
                        this.gameState = GameStateEnum.SPOTLIGHT_CHOICE;
                    }
                    else {
                        this.gameState = GameStateEnum.MISSION;
                    }
                }
                break;
            case GameStateEnum.SPOTLIGHT_CHOICE:
                if (clientAction.action === ActionEnum.USE_POWER) {
                    this.gameState = GameStateEnum.SPOTLIGHT_SELECT;
                    this.playerUsingPower = player;
                    this.removePowerFromPlayer(PowerTypeEnum.Spotlight, player);
                }
                else if (clientAction.action === ActionEnum.NEXT_STEP) {
                    this.gameState = GameStateEnum.MISSION;
                }
                break;
            case GameStateEnum.SPOTLIGHT_SELECT:
                // Player selects whose mission vote to see
                if (clientAction.action === ActionEnum.ADD_REMOVE_PLAYER_TEAM) {
                    const index = this.powerSelectionPlayers.findIndex(player => player.playerId === clientAction.playerId);
                    if (index !== -1) {
                        this.powerSelectionPlayers.splice(index, 1);
                    }
                    else {
                        this.powerSelectionPlayers.push(player);
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (this.powerSelectionPlayers.length === 1) {
                        this.playerSelectedForPower = this.powerSelectionPlayers[0];
                        this.powerSelectionPlayers = [];
                        this.gameState = GameStateEnum.SPOTLIGHT_VOTE;
                    }
                }
                break;
            case GameStateEnum.SPOTLIGHT_VOTE:
                if (clientAction.action === ActionEnum.VOTE_SUCCESS) {
                    currentMission.voteSuccess(player);
                    this.gameState = GameStateEnum.MISSION;
                }
                else if (clientAction.action === ActionEnum.VOTE_FAIL) {
                    currentMission.voteFail(player);
                    this.gameState = GameStateEnum.MISSION;
                }
                break;
            case GameStateEnum.MISSION:
                if (clientAction.action === ActionEnum.CANCEL_VOTE) {
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
                    this.playerSelectedForPower = undefined;
                    if (this.anyPlayerHasPower(PowerTypeEnum.KeepingCloseEyeOnYou)) {
                        this.gameState = GameStateEnum.KEEPING_CLOSE_EYE_CHOICE;
                    }
                    else {
                        this.gameState = GameStateEnum.MISSION_RESULT;
                    }
                }
                break;
            case GameStateEnum.KEEPING_CLOSE_EYE_CHOICE:
                if (clientAction.action === ActionEnum.USE_POWER) {
                    this.playerUsingPower = player;
                    this.gameState = GameStateEnum.KEEPING_CLOSE_EYE_SELECT;
                    this.removePowerFromPlayer(PowerTypeEnum.KeepingCloseEyeOnYou, player);
                }
                else if (clientAction.action === ActionEnum.NEXT_STEP) {
                    this.gameState = GameStateEnum.MISSION_RESULT;
                }
                break;
            case GameStateEnum.KEEPING_CLOSE_EYE_SELECT:
                // Player selects whose mission vote to see
                if (clientAction.action === ActionEnum.ADD_REMOVE_PLAYER_TEAM) {
                    const index = this.powerSelectionPlayers.findIndex(player => player.playerId === clientAction.playerId);
                    if (index !== -1) {
                        this.powerSelectionPlayers.splice(index, 1);
                    }
                    else {
                        this.powerSelectionPlayers.push(player);
                    }
                }
                else if (clientAction.action === ActionEnum.SUBMIT_TEAM) {
                    if (this.powerSelectionPlayers.length === 1) {
                        this.playerSelectedForPower = this.powerSelectionPlayers[0];
                        this.powerSelectionPlayers = [];
                        this.gameState = GameStateEnum.KEEPING_CLOSE_EYE_REVEAL;
                    }
                }
                break;
            case GameStateEnum.KEEPING_CLOSE_EYE_REVEAL:
                if (clientAction.action === ActionEnum.NEXT_STEP) {
                    this.playerSelectedForPower = undefined;
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
                        this.temporaryLeader = undefined;
                        this.startNewMission();
                        if (this.anyPlayerHasPower(PowerTypeEnum.StrongLeader)) {
                            this.gameState = GameStateEnum.STRONG_LEADER;
                        }
                        else {
                            this.players[this.getCurrentLeader()].isLeader = true;
                            this.drawnPower = this.drawRandomPower();
                            this.gameState = GameStateEnum.DRAW_POWER;
                        }
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

    goToNextRound(currentMission: IMission) {
        this.players[this.getCurrentLeader()].isLeader = false;
        currentMission.voteRejected();
        // If there was a temporary leader, revert to the normal order
        this.temporaryLeader = undefined;
        if (this.anyPlayerHasPower(PowerTypeEnum.StrongLeader)) {
            this.gameState = GameStateEnum.STRONG_LEADER;
        }
        else {
            this.players[this.getCurrentLeader()].isLeader = true;
            this.gameState = GameStateEnum.TEAM_SELECTION;
        }
    }

    resetGame(): void {
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

    getPlayer(playerId: string): IPlayer | undefined {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].playerId === playerId) {
                return this.players[i];
            }
        }
        return undefined;
    }

    addPlayer(player: IPlayer): void {
        this.addPlayerToArray(this.players, player);
    }

    removePlayer(playerId: string): void {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].playerId === playerId) {
                this.players.splice(i, 1);//delete element at i in array
                return;
            }
        }
    }

    startGame(io: Server): void {
        this.nbPlayersTotal = this.players.length;
        this.powerPool = this.nbPlayersTotal < 7 ? getSmallPowerPool() : getLargePowerPool();
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

    assignRoles(): void {
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

    acceptRole(player: IPlayer): void {
        this.addPlayerToArray(this.playerRoleAccepte, player);
        player.hasAcceptedRole = true;
    }

    hasEveryoneAcceptedRole(): boolean {
        return this.playerRoleAccepte.length == this.nbPlayersTotal;
    }

    startNewMission(): void {
        this.firstLeader = (this.getCurrentLeader() + 1) % this.nbPlayersTotal;
        this.lastLeader = (this.firstLeader + 4) % this.nbPlayersTotal;
        this.currentMission++;
    }
    getCurrentLeader(): number {
        if (this.temporaryLeader !== undefined) {
            return this.temporaryLeader;
        }
        return (this.firstLeader + this.missions[this.currentMission].currentRound) % this.nbPlayersTotal;
    }

    drawRandomPower(): IPower {
        const index = Math.floor(Math.random() * this.powerPool.length);
        // Removes an element from the array (in-place), while returning it
        return this.powerPool.splice(index, 1)[0];
    }

    givePowerToPlayer(player: IPlayer): void {
        if (!this.drawnPower) {
            return;
        }
        player.powers.push(this.drawnPower);
    }

    removePowerFromAllPlayer(powerType: PowerTypeEnum): void {
        for (const player of this.players) {
            this.removePowerFromPlayer(powerType, player);
        }
    };

    removePowerFromPlayer(powerType: PowerTypeEnum, player: IPlayer): void {
        const index = player.powers.findIndex(power => power.type === powerType)
        if (index !== -1) {
            player.powers.splice(index, 1);
        }
    }

    hasATeamWon(): boolean {
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

    private shuffle(array: IPlayer[]) {
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
    private addPlayerToArray(array: IPlayer[], player: IPlayer) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].playerId === player.playerId) {
                return;
            }
        }
        array.push(player);
    }

    private anyPlayerHasPower(powerType: PowerTypeEnum): boolean {
        return this.players.some(player => player.powers.some(power => power.type === powerType));
    }
};