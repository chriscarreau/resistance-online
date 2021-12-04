import { ActionEnum } from "./enums";

export interface ClientUpdateAction {
    action: ActionEnum;
    playerId: string;
    gameId: string;
}