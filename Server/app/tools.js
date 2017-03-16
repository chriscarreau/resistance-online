//Classe pour mettre en commun du code que l'on peut réutiliser partout (genre Enum)
module.exports = {
    arrayTeamSize: [
        [2,2,2,3,3,3],
        [3,3,3,4,4,4],
        [2,4,3,4,4,4],
        [3,3,4,5,5,5],
        [3,4,4,5,5,5],
    ],

    RoleEnum: {
        SPY : 0,
        RESISTANCE : 1
    },

    GameStateEnum: {
        NOT_STARTED : 0,
        DISTRIBUTE_ROLE : 1,
        TEAM_SELECTION : 2,
        VOTE : 3,
        VOTE_RESULT : 4,
        MISSION : 5,
        MISSION_RESULT : 6,
        GAME_OVER : 7
    },

    MissionResultEnum: {
        NO_RESULT : 0,
        SPY : 1,
        RESISTANCE : 2
    }
}