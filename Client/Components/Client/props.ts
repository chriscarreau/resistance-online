import { IGame } from "../../../shared/game.interface";
import { IPlayer } from "../../../shared/player.interface";
import { PowerTypeEnum } from "../../../shared/power.interface";

export interface IGameProps {
    game: IGame;
}

export interface IPlayerProps {
    player: IPlayer;
}

export interface IPowerChoiceProps {
    game: IGame;
    powerType: PowerTypeEnum;
}

export interface IPageRoleProps {
    player: IPlayer;
    spies: IPlayer[];
}

export interface ITeamSelectionProps {
    player: IPlayer;
    game: IGame;
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
  player: IPlayer;
  selected: boolean;
  hasVoted: boolean;
  lastLeader: boolean;
}