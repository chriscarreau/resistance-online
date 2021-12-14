import { ActionEnum } from "./enums";
import { PowerTypeEnum } from "./power.interface";

export interface ClientUpdateAction {
    action: ActionEnum;
    playerId: string;
    gameId: string;
    selectedPlayerId?: string;
    selectedPowerType?: PowerTypeEnum; 
}