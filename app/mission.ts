import util from "util";
import { Player } from "./player";
import { MissionResultEnum } from "./tools";

export class Mission {
    currentRound = 0;
    currentTeam: Player[] = [];
    result: MissionResultEnum = MissionResultEnum.NO_RESULT;
    teamSize: number = 0;
    playerAccept: Player[] = [];
    playerReject: Player[] = [];
    playerVoteSuccess: Player[] = [];
    playerVoteFail: Player[] = [];
    nbFailRequired: number = 1;

    addPlayerToTeam(player: Player) {
        this.addPlayerToArray(this.currentTeam, player);
    }

    removePlayerFromTeam(playerId: string) {
        for(var i = 0; i < this.currentTeam.length; i++){
            if(this.currentTeam[i].playerId === playerId){
                this.currentTeam.splice(i, 1);//delete element at i in array
                return;
            }
        }
    }
    
    isPlayerInTeam(playerId: string) {
        for(var i = 0; i < this.currentTeam.length; i++){
            if(this.currentTeam[i].playerId === playerId){
                return true;
            }
        }
    }

    isCurrentTeamComplete() {
        return this.currentTeam.length === this.teamSize;
    }

    acceptTeam(player: Player) {
        this.addPlayerToArray(this.playerAccept, player);
    }

    rejectTeam(player: Player) {
        this.addPlayerToArray(this.playerReject, player);
    }

    cancelVote(player: Player) {
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

    hasEveryoneVoted(nbTotalPlayers: number) {
        return (this.playerAccept.length + this.playerReject.length >= nbTotalPlayers);
    }

    isMissionAccepted() {
        return (this.playerAccept.length > this.playerReject.length);
    }

    voteRejected() {
        this.currentRound++;
        this.currentTeam = [];
        this.playerAccept = [];
        this.playerReject = [];
    }
    voteSuccess(player: Player) {
        this.addPlayerToArray(this.playerVoteSuccess, player);
    }
    
    voteFail(player: Player) {
        this.addPlayerToArray(this.playerVoteFail, player);
    }

    cancelMissionVote(player: Player) {
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
    isMissionComplete() {
        return (this.playerVoteSuccess.length + this.playerVoteFail.length >= this.teamSize);
    }

    getMissionResult() {
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
    private addPlayerToArray(array: Player[], player: Player){
        for(var i = 0; i < array.length; i++){
            if(array[i].playerId === player.playerId){
                return;
            }
        }
        array.push(player);
    }
};