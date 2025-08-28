
export enum TournamentStage {
    REGISTRATION = 'REGISTRATION',
    GROUP_STAGE = 'GROUP_STAGE',
    KNOCKOUT_STAGE = 'KNOCKOUT_STAGE',
    FINISHED = 'FINISHED',
}

export interface Player {
    id: string;
    name: string;
}

export interface Match {
    id: string;
    homeTeam: Player;
    awayTeam: Player;
    homeScore: number | null;
    awayScore: number | null;
    played: boolean;
    group?: string;
    round?: 'QF' | 'SF' | 'F';
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
}

export interface KnockoutMatch {
    quarters?: (Match | null)[];
    semis?: (Match | null)[];
    final?: Match | null;
}
