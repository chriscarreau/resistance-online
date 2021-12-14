import { Server } from "socket.io";
import { ClientUpdateAction } from "./client-update-action.interface";
import { GameStateEnum } from "./enums";
import { IMission } from "./mission.interface";
import { IPlayer } from "./player.interface";
import { IPower, PowerTypeEnum } from "./power.interface";

export interface IGame {
    gameId: string;
    firstPlayer?: IPlayer;
    players: IPlayer[] ;
    spy: IPlayer[];
    resistance: IPlayer[];
    missions: IMission[];
    currentMission: number;
    firstLeader: number;
    lastLeader: number;
    nbPlayersTotal: number;
    playerRoleAccepte: IPlayer[];
    teamSizes: number[];
    hostId: string;
    powerPool: IPower[];
    drawnPower?: IPower;
    temporaryLeader?: number;
    powerSelectionPlayers: IPlayer[];
    powerStealingSelection: {player: IPlayer, powerType: PowerTypeEnum}[];
    playerSelectedForPower?: IPlayer;
    playerUsingPower?: IPlayer;
    gameState: GameStateEnum;
    
    update(io: Server, clientAction: ClientUpdateAction): void;

    resetGame(): void;

    getPlayer(playerId: string): IPlayer | undefined;

    addPlayer(player: IPlayer): void;

    removePlayer(playerId: string): void;

    startGame(io: Server): void;

    assignRoles(): void;

    acceptRole(player: IPlayer): void;

    hasEveryoneAcceptedRole(): boolean;

    startNewMission(): void;

    getCurrentLeader(): number;
    
    drawRandomPower(): IPower;

    givePowerToPlayer(player: IPlayer): void;

    removePowerFromAllPlayer(powerType: PowerTypeEnum): void;

    removePowerFromPlayer(powerType: PowerTypeEnum, player: IPlayer): void;

    hasATeamWon(): boolean;
}