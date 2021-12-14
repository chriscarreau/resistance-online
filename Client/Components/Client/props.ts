import { IGame } from "../../../shared/game.interface";
import { IPlayer } from "../../../shared/player.interface";
import { PowerTypeEnum } from "../../../shared/power.interface";

export interface IGameProps {
    game: IGame;
}

export interface IPageVoteProps {
    game: IGame;
    isOpinionMaker: boolean;
}

export interface IPageMissionProps {
    game: IGame;
    isSpotlight: boolean;
}


export interface IPlayerProps {
    player: IPlayer;
}

export interface IPowerProps {
    powerType: PowerTypeEnum;
}

export interface IPowerChoiceProps {
    game: IGame;
    powerType: PowerTypeEnum;
}

export interface IPageRoleProps {
    player: IPlayer;
    spies: IPlayer[];
}

export interface IPageRevealProps {
    game: IGame;
    playerSeeing: IPlayer;
    playerRevealing: IPlayer;
}


export interface ITeamSelectionProps {
    player: IPlayer;
    game: IGame;
}

export interface IPowerSelectionProps {
    selectingPlayer: IPlayer;
    powerType: PowerTypeEnum;
    players: IPlayer[];
    game: IGame;
}

export interface IPlayerPowerBarProps {
    player: IPlayer;
    powerType: PowerTypeEnum;
    selected: boolean;
}

export interface IPlayerBarProps {
    player: IPlayer;
    selected: boolean;
}

export interface IPlayersProps {
    players: IPlayer[];
    game: IGame;
}

export interface IPastilleProps {
    color: string;
    teamSize: number;
    isCurrentMission: boolean;
}

export interface IPlayerCardProps {
  game: IGame;
  player: IPlayer;
  selected: boolean;
  hasVoted: boolean;
  lastLeader: boolean;
}