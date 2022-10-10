import { CharacterState } from "../utilities"
import { ReplacementMap } from "./Replacement.interface"

export interface ChallengeState {
    challenge_id: string,
    author: string,
    encoded: string
}

export interface GameState {
    challenge: ChallengeState | null,
    currentText: string,
    correctCharacters: number[],
    replacements: ReplacementMap,
    characterStates: CharacterState[]
}