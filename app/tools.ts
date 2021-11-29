//Classe pour mettre en commun du code que l'on peut réutiliser partout (genre Enum)

export const arrayTeamSize: number[][] =  [
    [2,2,2,3,3,3],
    [3,3,3,4,4,4],
    [2,4,3,4,4,4],
    [3,3,4,5,5,5],
    [3,4,4,5,5,5],
];

export enum RoleEnum {
    SPY = 0,
    RESISTANCE = 1
}

export enum GameStateEnum {
    NOT_STARTED = 0,
    DISTRIBUTE_ROLE = 1,
    TEAM_SELECTION = 2,
    VOTE = 3,
    VOTE_RESULT = 4,
    MISSION = 5,
    MISSION_RESULT = 6,
    GAME_OVER = 7
}

export enum  MissionResultEnum {
    NO_RESULT = 0,
    SPY = 1,
    RESISTANCE = 2
}

export enum ActionEnum {
    START_GAME = "START_GAME",
    ACCEPT_ROLE = "ACCEPT_ROLE",
    ADD_REMOVE_PLAYER_TEAM = "ADD_REMOVE_PLAYER_TEAM",
    SUBMIT_TEAM = "SUBMIT_TEAM",
    CANCEL_MISSION = "CANCEL_MISSION",
    CANCEL_VOTE = "CANCEL_VOTE",
    VOTE_ACCEPT = "VOTE_ACCEPT",
    VOTE_REJECT = "VOTE_REJECT",
    REVEAL_VOTE = "REVEAL_VOTE",
    NEXT_STEP = "NEXT_STEP",
    VOTE_SUCCESS = "VOTE_SUCCESS",
    VOTE_FAIL = "VOTE_FAIL",
    REVEAL_MISSION = "REVEAL_MISSION"
}

export interface ClientUpdateAction {
    action: ActionEnum;
    playerId: string;
    gameId: string;
}