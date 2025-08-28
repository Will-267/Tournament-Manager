<<<<<<< HEAD
=======

>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
export enum TournamentStage {
    REGISTRATION = 'REGISTRATION',
    GROUP_STAGE = 'GROUP_STAGE',
    KNOCKOUT_STAGE = 'KNOCKOUT_STAGE',
    FINISHED = 'FINISHED',
}

<<<<<<< HEAD
export type RegistrationType = 'LOBBY' | 'MANUAL';

export interface User {
    id: string;
    username: string;
}

export interface Player {
    id: string;
    name: string;
    teamName?: string;
}

export interface Match {
    id:string;
=======
export interface Player {
    id: string;
    name: string;
}

export interface Match {
    id: string;
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
    homeTeam: Player;
    awayTeam: Player;
    homeScore: number | null;
    awayScore: number | null;
    played: boolean;
    group?: string;
<<<<<<< HEAD
    round?: string;
=======
    round?: 'QF' | 'SF' | 'F';
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
}

export interface Group {
    id: string;
    name: string;
    players: Player[];
}

export interface Standing {
    playerId: string;
    playerName: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    rank: number;
<<<<<<< HEAD
    groupName: string;
}

export interface KnockoutMatch {
    rounds: Match[][];
}

export interface Tournament {
    id: string;
    name: string;
    createdBy: string; // username of creator
    stage: TournamentStage;
    registrationType: RegistrationType; // New field
    players: Player[]; // players who have joined
    groups: Group[];
    matches: Match[];
    knockoutMatches: KnockoutMatch;
=======
}

export interface KnockoutMatch {
    quarters?: (Match | null)[];
    semis?: (Match | null)[];
    final?: Match | null;
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
}
