import { IPower, PowerTypeEnum } from "./power.interface";
import { EstablishConfidence, KeepingCloseEyeOnYou, NoConfidence, OpenUp, OpinionMaker, OverheardConversation, Spotlight, StrongLeader, TakeResponsability } from "../app/Powers";

export const arrayTeamSize: number[][] =  [
    [2,2,2,3,3,3],
    [3,3,3,4,4,4],
    [2,4,3,4,4,4],
    [3,3,4,5,5,5],
    [3,4,4,5,5,5],
];

export function getSmallPowerPool(): IPower[] {
    return [
        new KeepingCloseEyeOnYou(),
        new KeepingCloseEyeOnYou(),
        new NoConfidence(),
        new NoConfidence(),
        new StrongLeader(),
        new StrongLeader(),
        new OpinionMaker(),
        new TakeResponsability()
    ]
};


export function getLargePowerPool(): IPower[] {
    return [
        new KeepingCloseEyeOnYou(),
        new KeepingCloseEyeOnYou(),
        new NoConfidence(),
        new NoConfidence(),
        new NoConfidence(),
        new StrongLeader(),
        new StrongLeader(),
        new OpinionMaker(),
        new OpinionMaker(),
        new TakeResponsability(),
        new Spotlight(),
        new OverheardConversation(),
        new OverheardConversation(),
        new EstablishConfidence(),
        new OpenUp()
    ]
};

export const PowerNames = {
    [PowerTypeEnum.OpinionMaker]: "Leader d'opinion",
    [PowerTypeEnum.KeepingCloseEyeOnYou]: "Conversation surprise",
    [PowerTypeEnum.Spotlight]: "En pleine lumière",
    [PowerTypeEnum.OverheardConversation]: "Oreille indiscrète",
    [PowerTypeEnum.StrongLeader]: "Leader charismatique",
    [PowerTypeEnum.NoConfidence]: "Vote de défiance",
    [PowerTypeEnum.EstablishConfidence]: "Question de confiance",
    [PowerTypeEnum.OpenUp]: "Confidence",
    [PowerTypeEnum.TakeResponsability]: "Prendre les choses en mains"
}

export const PowerDescriptions = {
    [PowerTypeEnum.OpinionMaker]: "Vous devez voter face visible et avant les autres joueurs pour le reste de la partie",
    [PowerTypeEnum.KeepingCloseEyeOnYou]: "Vous pouvez regarder une carte Mission jouée par un autre joueur",
    [PowerTypeEnum.Spotlight]: "Vous pouvez forcer un joueur à révéler la carte Mission qu'il va choisir",
    [PowerTypeEnum.OverheardConversation]: "Vous devez regarder la carte identité de votre voisin de gauche ou de droite",
    [PowerTypeEnum.StrongLeader]: "Vous pouvez devenir le nouveau Leader; à jouer avant que les cartes Complots (pouvoirs) ou Escouades (gun) ne soient distribuées",
    [PowerTypeEnum.NoConfidence]: "Vous pouvez annuler un vote positif et ainsi changer de leader",
    [PowerTypeEnum.EstablishConfidence]: "Le leader doit montrer sa carte identité au joueur de son choix",
    [PowerTypeEnum.OpenUp]: "Vous devez révéler votre carte identité au joueur de votre choix",
    [PowerTypeEnum.TakeResponsability]: "Vous devez voler une carte Complot à un autre joueur"
}









