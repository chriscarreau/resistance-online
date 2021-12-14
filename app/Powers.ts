import { PowerDescriptions, PowerNames } from "../shared/constants";
import { IPower, PowerTypeEnum } from "../shared/power.interface";

export class OpinionMaker implements IPower {
    type = PowerTypeEnum.OpinionMaker;
    name = PowerNames[PowerTypeEnum.OpinionMaker]
    description = PowerDescriptions[PowerTypeEnum.OpinionMaker];
}
export class KeepingCloseEyeOnYou implements IPower {
    type = PowerTypeEnum.KeepingCloseEyeOnYou;
    name = PowerNames[PowerTypeEnum.KeepingCloseEyeOnYou]
    description = PowerDescriptions[PowerTypeEnum.KeepingCloseEyeOnYou];
}
export class Spotlight implements IPower {
    type = PowerTypeEnum.Spotlight;
    name = PowerNames[PowerTypeEnum.Spotlight]
    description = PowerDescriptions[PowerTypeEnum.Spotlight];
}
export class OverheardConversation implements IPower {
    type = PowerTypeEnum.OverheardConversation;
    name = PowerNames[PowerTypeEnum.OverheardConversation]
    description = PowerDescriptions[PowerTypeEnum.OverheardConversation];
}
export class StrongLeader implements IPower {
    type = PowerTypeEnum.StrongLeader;
    name = PowerNames[PowerTypeEnum.StrongLeader]
    description = PowerDescriptions[PowerTypeEnum.StrongLeader];
}
export class NoConfidence implements IPower {
    type = PowerTypeEnum.NoConfidence;
    name = PowerNames[PowerTypeEnum.NoConfidence]
    description = PowerDescriptions[PowerTypeEnum.NoConfidence];
}
export class EstablishConfidence implements IPower {
    type = PowerTypeEnum.EstablishConfidence;
    name = PowerNames[PowerTypeEnum.EstablishConfidence]
    description = PowerDescriptions[PowerTypeEnum.EstablishConfidence];
}
export class OpenUp implements IPower {
    type = PowerTypeEnum.OpenUp;
    name = PowerNames[PowerTypeEnum.OpenUp]
    description = PowerDescriptions[PowerTypeEnum.OpenUp];
}
export class TakeResponsability implements IPower {
    type = PowerTypeEnum.TakeResponsability;
    name = PowerNames[PowerTypeEnum.TakeResponsability]
    description = PowerDescriptions[PowerTypeEnum.TakeResponsability];
}