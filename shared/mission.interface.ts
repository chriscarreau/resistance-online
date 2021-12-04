import { MissionResultEnum } from "./enums";
import { IPlayer } from "./player.interface";

export interface IMission {
    currentRound: number;
    currentTeam: IPlayer[];
    result: MissionResultEnum;
    teamSize: number;
    playerAccept: IPlayer[];
    playerReject: IPlayer[];
    playerVoteSuccess: IPlayer[];
    playerVoteFail: IPlayer[];
    nbFailRequired: number;

    addPlayerToTeam(player: IPlayer): void;

    removePlayerFromTeam(playerId: string): void;
    
    isPlayerInTeam(playerId: string): boolean;

    isCurrentTeamComplete(): boolean;

    acceptTeam(player: IPlayer): void;

    rejectTeam(player: IPlayer): void;

    cancelVote(player: IPlayer): void;

    hasEveryoneVoted(nbTotalPlayers: number): boolean;

    isMissionAccepted(): boolean;

    voteRejected(): void;

    voteSuccess(player: IPlayer): void;
    
    voteFail(player: IPlayer): void;

    cancelMissionVote(player: IPlayer): void;
    isMissionComplete(): boolean;

    getMissionResult(): MissionResultEnum;
}