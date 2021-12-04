import { RoleEnum } from "./enums";
import { IPower } from "./power.interface";

export interface IPlayer {
    playerId: string;
    playerName: string;
    role?: RoleEnum;
    isLeader: boolean;
    nbMissionBleu: number;
    nbMissionRouge: number;
    hasAcceptedRole: boolean;
    powers: IPower[];
}