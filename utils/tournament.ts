
import { Player, Group, Match, Standing, KnockoutMatch } from './types';

// Helper to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

<<<<<<< HEAD
// For LOBBY mode: Shuffles players into new groups and creates fixtures
export const generateGroupsAndFixtures = (players: Player[]): { groups: Group[], matches: Match[] } => {
    const shuffledPlayers = shuffleArray(players);
    const numPlayers = players.length;
    // Aim for groups of 4-5 players, but allow for 3 if necessary.
    const numGroups = Math.max(1, Math.round(numPlayers / 4));
    
    const groups: Group[] = Array.from({ length: numGroups }, (_, i) => ({
        id: `g${i + 1}`,
        name: `Group ${String.fromCharCode(65 + i)}`,
        players: [],
    }));

    // Distribute players into groups as evenly as possible
    shuffledPlayers.forEach((player, index) => {
        groups[index % numGroups].players.push(player);
    });

    return { groups, matches: generateFixturesForGroups(groups) };
};

// For MANUAL mode: Creates fixtures for groups that have already been manually configured
export const generateFixturesForGroups = (groups: Group[]): Match[] => {
=======
export const generateGroupsAndFixtures = (players: Player[]): { groups: Group[], matches: Match[] } => {
    const shuffledPlayers = shuffleArray(players);
    const groups: Group[] = [
        { id: 'g1', name: 'Group A', players: shuffledPlayers.slice(0, 5) },
        { id: 'g2', name: 'Group B', players: shuffledPlayers.slice(5, 10) },
        { id: 'g3', name: 'Group C', players: shuffledPlayers.slice(10, 15) },
    ];

>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
    let matches: Match[] = [];
    let matchIdCounter = 1;

    groups.forEach(group => {
<<<<<<< HEAD
        const players = group.players;
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                matches.push({
                    id: `m${matchIdCounter++}`,
                    homeTeam: players[i],
                    awayTeam: players[j],
=======
        for (let i = 0; i < group.players.length; i++) {
            for (let j = i + 1; j < group.players.length; j++) {
                matches.push({
                    id: `m${matchIdCounter++}`,
                    homeTeam: group.players[i],
                    awayTeam: group.players[j],
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
                    homeScore: null,
                    awayScore: null,
                    played: false,
                    group: group.id,
                });
            }
        }
    });

<<<<<<< HEAD
    return shuffleArray(matches);
};


export const calculateStandingsForGroup = (group: Group, groupMatches: Match[]): Standing[] => {
    const standingsMap: Map<string, Standing> = new Map(
        group.players.map(p => [
=======
    return { groups, matches: shuffleArray(matches) };
};

export const calculateStandingsForGroup = (groupPlayers: Player[], groupMatches: Match[]): Standing[] => {
    const standingsMap: Map<string, Standing> = new Map(
        groupPlayers.map(p => [
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
            p.id,
            {
                playerId: p.id,
                playerName: p.name,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0,
                rank: 0,
<<<<<<< HEAD
                groupName: group.name,
=======
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
            }
        ])
    );

    groupMatches.forEach(match => {
        if (!match.played || match.homeScore === null || match.awayScore === null) return;

        const homeStanding = standingsMap.get(match.homeTeam.id)!;
        const awayStanding = standingsMap.get(match.awayTeam.id)!;

        homeStanding.played++;
        awayStanding.played++;

        homeStanding.goalsFor += match.homeScore;
        homeStanding.goalsAgainst += match.awayScore;
        awayStanding.goalsFor += match.awayScore;
        awayStanding.goalsAgainst += match.homeScore;

        homeStanding.goalDifference = homeStanding.goalsFor - homeStanding.goalsAgainst;
        awayStanding.goalDifference = awayStanding.goalsFor - awayStanding.goalsAgainst;

        if (match.homeScore > match.awayScore) {
            homeStanding.wins++;
            homeStanding.points += 3;
            awayStanding.losses++;
        } else if (match.homeScore < match.awayScore) {
            awayStanding.wins++;
            awayStanding.points += 3;
            homeStanding.losses++;
        } else {
            homeStanding.draws++;
            homeStanding.points += 1;
            awayStanding.draws++;
            awayStanding.points += 1;
        }
    });

    const sortedStandings = Array.from(standingsMap.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.playerName.localeCompare(b.playerName);
    });
    
    return sortedStandings.map((s, index) => ({...s, rank: index + 1}));
};

export const calculateAllStandings = (groups: Group[], matches: Match[]): Record<string, Standing[]> => {
    const allStandings: Record<string, Standing[]> = {};
    groups.forEach(group => {
        const groupMatches = matches.filter(m => m.group === group.id);
<<<<<<< HEAD
        allStandings[group.id] = calculateStandingsForGroup(group, groupMatches);
=======
        allStandings[group.id] = calculateStandingsForGroup(group.players, groupMatches);
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
    });
    return allStandings;
};

<<<<<<< HEAD
const getKnockoutSize = (numPlayers: number): number => {
    if (numPlayers < 8) return 4;
    // Find the largest power of 2 that is less than or equal to the number of players
    let power = 1;
    while (power * 2 <= numPlayers) {
        power *= 2;
    }
    // Usually, we want about half the players to qualify
    return Math.max(4, power);
};

export const determineKnockoutQualifiers = (standings: Record<string, Standing[]>, groups: Group[], numPlayers: number): Player[] => {
    const knockoutSize = getKnockoutSize(numPlayers);
    const qualifiers: Player[] = [];
    const qualifiedIds = new Set<string>();

    const remainingPlayers: Standing[] = [];

    groups.forEach(group => {
        const groupStandings = standings[group.id];
        if (groupStandings && groupStandings.length > 0) {
            remainingPlayers.push(...groupStandings);
        }
    });

    // Sort all players from all groups together to find the best performers overall
    remainingPlayers.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return 0; // Keep original order if all stats are identical
    });
    
    for (const p of remainingPlayers) {
        if (qualifiers.length < knockoutSize && !qualifiedIds.has(p.playerId)) {
            qualifiers.push({ id: p.playerId, name: p.playerName });
            qualifiedIds.add(p.playerId);
        }
    }
    
    return qualifiers;
};

const getRoundName = (numMatches: number): string => {
    if (numMatches === 1) return 'Final';
    if (numMatches === 2) return 'Semi-Finals';
    if (numMatches === 4) return 'Quarter-Finals';
    return `Round of ${numMatches * 2}`;
};

export const generateKnockoutBracket = (qualifiers: Player[]): KnockoutMatch => {
    const shuffledQualifiers = shuffleArray(qualifiers);
    const TBD_PLAYER: Player = { id: 'TBD', name: '...' };
    
    const rounds: Match[][] = [];
    let currentRoundQualifiers = [...shuffledQualifiers];
    let roundCounter = 1;

    while (currentRoundQualifiers.length >= 2) {
        const roundMatches: Match[] = [];
        const numMatches = currentRoundQualifiers.length / 2;
        const roundName = getRoundName(numMatches);

        for (let i = 0; i < numMatches; i++) {
            roundMatches.push({
                id: `R${roundCounter}M${i+1}`,
                homeTeam: currentRoundQualifiers[i * 2] || TBD_PLAYER,
                awayTeam: currentRoundQualifiers[i * 2 + 1] || TBD_PLAYER,
                homeScore: null,
                awayScore: null,
                played: false,
                round: roundName,
            });
        }
        rounds.push(roundMatches);
        currentRoundQualifiers = Array(numMatches).fill(TBD_PLAYER);
        roundCounter++;
    }
    
    return { rounds };
=======
export const determineKnockoutQualifiers = (standings: Record<string, Standing[]>, groups: Group[]): Player[] => {
    const qualifiers: Player[] = [];
    const thirdPlaceFinishers: Standing[] = [];

    groups.forEach(group => {
        const groupStandings = standings[group.id];
        if (groupStandings) {
            qualifiers.push(...groupStandings.slice(0, 2).map(s => ({id: s.playerId, name: s.playerName})));
            if (groupStandings[2]) {
                thirdPlaceFinishers.push(groupStandings[2]);
            }
        }
    });

    thirdPlaceFinishers.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return 0; // Should not happen with different players
    });

    qualifiers.push(...thirdPlaceFinishers.slice(0, 2).map(s => ({id: s.playerId, name: s.playerName})));

    // Re-map standings to qualifiers for seeding
    const seededQualifiers: { player: Player; seed: string }[] = [];
    groups.forEach(group => {
        const groupStandings = standings[group.id];
        seededQualifiers.push({ player: {id: groupStandings[0].playerId, name: groupStandings[0].playerName}, seed: `${group.name.slice(-1)}1` });
        seededQualifiers.push({ player: {id: groupStandings[1].playerId, name: groupStandings[1].playerName}, seed: `${group.name.slice(-1)}2` });
    });
    const bestThirds = thirdPlaceFinishers.slice(0,2);
    seededQualifiers.push({ player: {id: bestThirds[0].playerId, name: bestThirds[0].playerName}, seed: `3rd1` });
    seededQualifiers.push({ player: {id: bestThirds[1].playerId, name: bestThirds[1].playerName}, seed: `3rd2` });

    const getPlayerBySeed = (seed: string) => seededQualifiers.find(q => q.seed === seed)!.player;

    // Fixed seeding based on group positions
    return [
        getPlayerBySeed('A1'), getPlayerBySeed('3rd2'), // Match 1
        getPlayerBySeed('C1'), getPlayerBySeed('B2'), // Match 2
        getPlayerBySeed('B1'), getPlayerBySeed('3rd1'), // Match 3
        getPlayerBySeed('A2'), getPlayerBySeed('C2')  // Match 4
    ];
};

export const generateKnockoutBracket = (qualifiers: Player[]): KnockoutMatch => {
    const TBD_PLAYER: Player = { id: 'TBD', name: 'To be determined' };
    
    const quarters: Match[] = [
        { id: 'QF1', homeTeam: qualifiers[0], awayTeam: qualifiers[1], homeScore: null, awayScore: null, played: false, round: 'QF' },
        { id: 'QF2', homeTeam: qualifiers[2], awayTeam: qualifiers[3], homeScore: null, awayScore: null, played: false, round: 'QF' },
        { id: 'QF3', homeTeam: qualifiers[4], awayTeam: qualifiers[5], homeScore: null, awayScore: null, played: false, round: 'QF' },
        { id: 'QF4', homeTeam: qualifiers[6], awayTeam: qualifiers[7], homeScore: null, awayScore: null, played: false, round: 'QF' },
    ];
    
    const semis: Match[] = [
        { id: 'SF1', homeTeam: TBD_PLAYER, awayTeam: TBD_PLAYER, homeScore: null, awayScore: null, played: false, round: 'SF' },
        { id: 'SF2', homeTeam: TBD_PLAYER, awayTeam: TBD_PLAYER, homeScore: null, awayScore: null, played: false, round: 'SF' },
    ];

    const final: Match = {
        id: 'F', homeTeam: TBD_PLAYER, awayTeam: TBD_PLAYER, homeScore: null, awayScore: null, played: false, round: 'F'
    };
    
    return { quarters, semis, final };
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
};
