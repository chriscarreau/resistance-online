import { IPower } from "../shared/power.interface";
import { IPlayer } from "../shared/player.interface";
import { RoleEnum } from "../shared/enums";

export class Player implements IPlayer {
    playerId: string;
    playerName: string;
    role?: RoleEnum;
    isLeader: boolean = false;
    nbMissionBleu: number = 0;
    nbMissionRouge: number = 0;
    hasAcceptedRole: boolean = false;
    powers: IPower[] = [];

    constructor(playerId: string, playerName: string) {
        this.playerId = playerId;
        this.playerName = playerName;
    }
}