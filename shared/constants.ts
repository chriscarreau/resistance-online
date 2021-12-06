import { IPower } from "./power.interface";
import { EstablishConfidence, KeepingCloseEyeOnYou, NoConfidence, OpenUp, OpinionMaker, OverheardConversation, Spotlight, StrongLeader, TakeResponsability } from "../app/Powers";

export const arrayTeamSize: number[][] =  [
    [2,2,2,3,3,3],
    [3,3,3,4,4,4],
    [2,4,3,4,4,4],
    [3,3,4,5,5,5],
    [3,4,4,5,5,5],
];

// export function getSmallPowerPool(): IPower[] {
//     return [
//         new KeepingCloseEyeOnYou(),
//         new KeepingCloseEyeOnYou(),
//         new NoConfidence(),
//         new NoConfidence(),
//         new StrongLeader(),
//         new StrongLeader(),
//         new OpinionMaker(),
//         new TakeResponsability()
//     ]
// };


export function getSmallPowerPool(): IPower[] {
    return [
        new Spotlight(),
        new Spotlight(),
        new Spotlight(),
        new Spotlight(),
        new Spotlight(),
        new Spotlight(),
        new Spotlight(),
        // new OverheardConversation(),
        // new EstablishConfidence(),
        // new OpenUp()
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