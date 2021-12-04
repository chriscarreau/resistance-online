import { IPower, PowerTypeEnum } from "../shared/power.interface";

export class OpinionMaker implements IPower {
    type = PowerTypeEnum.OpinionMaker;
    name = "Leader d'opinion";
    description = "Vous devez voter face visible et avant les autres joueurs pour le reste de la partie";
}
export class KeepingCloseEyeOnYou implements IPower {
    type = PowerTypeEnum.KeepingCloseEyeOnYou;
    name = "Conversation surprise"
    description = "Vous pouvez regarder une carte Mission jouée par un autre joueur";
}
export class Spotlight implements IPower {
    type = PowerTypeEnum.Spotlight;
    name = "En pleine lumière"
    description = "Vous pouvez forcer un joueur à révéler la carte Mission qu'il va choisir";
}
export class OverheardConversation implements IPower {
    type = PowerTypeEnum.OverheardConversation;
    name = "Oreille indiscrète"
    description = "Vous devez regarder la carte identité de votre voisin de gauche ou de droite";
}
export class StrongLeader implements IPower {
    type = PowerTypeEnum.StrongLeader;
    name = "Leader charismatique"
    description = "Vous pouvez devenir le nouveau Leader; à jouer avant que les cartes Complots (pouvoirs) ou Escouades (gun) ne soient distribuées";
}
export class NoConfidence implements IPower {
    type = PowerTypeEnum.NoConfidence;
    name = "Vote de défiance"
    description = "Vous pouvez annuler un vote positif et ainsi changer de leader";
}
export class EstablishConfidence implements IPower {
    type = PowerTypeEnum.EstablishConfidence;
    name = "Question de confiance"
    description = "Le leader doit montrer sa carte identité au joueur de son choix";
}
export class OpenUp implements IPower {
    type = PowerTypeEnum.OpenUp;
    name = "Confidence"
    description = "Vous devez révéler votre carte identité au joueur de votre choix";
}
export class TakeResponsability implements IPower {
    type = PowerTypeEnum.TakeResponsability;
    name = "Prendre les choses en mains"
    description = "Vous devez voler une carte Complot à un autre joueur";
}