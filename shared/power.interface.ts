export interface IPower {
    type: PowerTypeEnum;
    name: string;
    description: string;
}

export enum PowerTypeEnum {
    OpinionMaker,
    KeepingCloseEyeOnYou,
    Spotlight,
    OverheardConversation,
    StrongLeader,
    NoConfidence,
    EstablishConfidence,
    OpenUp,
    TakeResponsability
} 