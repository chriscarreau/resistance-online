import { RoleEnum } from "./tools";

export class Player {
    playerId: string;
    playerName: string;
    role?: RoleEnum;
    isLeader: boolean = false;
    nbMissionBleu: number = 0;
    nbMissionRouge: number = 0;
    hasAcceptedRole: boolean = false;
    constructor(playerId: string, playerName: string) {
        this.playerId = playerId;
        this.playerName = playerName;
    }
}