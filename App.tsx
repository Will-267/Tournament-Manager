<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { getCurrentUser, User } from './utils/auth';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import TournamentPage from './TournamentPage';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
    const [hash, setHash] = useState(window.location.hash);

    useEffect(() => {
        const handleAuthChange = () => {
            setCurrentUser(getCurrentUser());
        };

        const handleHashChange = () => {
            setHash(window.location.hash);
        };

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const renderContent = () => {
        if (!currentUser) {
            return <AuthPage />;
        }

        const parts = hash.replace(/^#\//, '').split('/');
        
        if (parts[0] === 'tournaments' && parts[1]) {
            return <TournamentPage tournamentId={parts[1]} currentUser={currentUser} />;
        }
        
        return <Dashboard currentUser={currentUser} />;
    };

    return <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">{renderContent()}</div>;
};

export default App;
=======

import React, { useState, useCallback, useMemo } from 'react';
import { TournamentStage, Player, Group, Match, Standing, KnockoutMatch } from './types';
import { generateGroupsAndFixtures, calculateAllStandings, determineKnockoutQualifiers, generateKnockoutBracket } from './utils/tournament';
import { TrophyIcon, ArrowRightIcon, UsersIcon } from './components/IconComponents';
import GroupStageView from './components/GroupStageView';
import KnockoutBracket from './components/KnockoutBracket';
import ScoreModal from './components/ScoreModal';

const MAX_PLAYERS = 15;

const App: React.FC = () => {
    const [stage, setStage] = useState<TournamentStage>(TournamentStage.REGISTRATION);
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [groups, setGroups] = useState<Group[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch>({});
    const [standings, setStandings] = useState<Record<string, Standing[]>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim() && players.length < MAX_PLAYERS && !players.some(p => p.name === newPlayerName.trim())) {
            setPlayers([...players, { id: `p${players.length + 1}`, name: newPlayerName.trim() }]);
            setNewPlayerName('');
        }
    };
    
    const startTournament = () => {
        if (players.length !== MAX_PLAYERS) {
            alert(`You need ${MAX_PLAYERS} players to start the tournament.`);
            return;
        }
        const { groups: newGroups, matches: newMatches } = generateGroupsAndFixtures(players);
        setGroups(newGroups);
        setMatches(newMatches);
        setStandings(calculateAllStandings(newGroups, newMatches));
        setStage(TournamentStage.GROUP_STAGE);
    };

    const handleUpdateScore = (matchId: string, homeScore: number, awayScore: number) => {
        if (stage === TournamentStage.GROUP_STAGE) {
            setMatches(prevMatches =>
                prevMatches.map(m =>
                    m.id === matchId ? { ...m, homeScore, awayScore, played: true } : m
                )
            );
        } else if (stage === TournamentStage.KNOCKOUT_STAGE) {
             setKnockoutMatches(prev => {
                const newKnockoutMatches = JSON.parse(JSON.stringify(prev));
                const allRounds = [
                    ...newKnockoutMatches.quarters, 
                    ...newKnockoutMatches.semis, 
                    newKnockoutMatches.final
                ];
                const matchToUpdate = allRounds.find(m => m && m.id === matchId);
                if(matchToUpdate) {
                    matchToUpdate.homeScore = homeScore;
                    matchToUpdate.awayScore = awayScore;
                    matchToUpdate.played = true;
                }
                return newKnockoutMatches;
            });
        }
        setIsModalOpen(false);
        setSelectedMatch(null);
    };
    
    React.useEffect(() => {
        if (stage === TournamentStage.GROUP_STAGE) {
            setStandings(calculateAllStandings(groups, matches));
        }
    }, [matches, groups, stage]);

    React.useEffect(() => {
        if (stage === TournamentStage.KNOCKOUT_STAGE && Object.keys(knockoutMatches).length > 0) {
            const updatedKnockoutMatches = { ...knockoutMatches };

            const processRound = <T extends Match,>(roundMatches: (T | null)[], nextRoundMatches: (T | null)[], nextRoundKey: 'semis' | 'final') => {
                 roundMatches.forEach((match, index) => {
                    if (match && match.played) {
                        const winner = match.homeScore > match.awayScore ? match.homeTeam : match.awayTeam;
                        const nextMatchIndex = Math.floor(index / 2);
                        const nextMatch = nextRoundMatches[nextMatchIndex];
                        if (nextMatch && !nextMatch.played) {
                            if (index % 2 === 0) {
                                if (nextMatch.homeTeam.id === 'TBD') nextMatch.homeTeam = winner;
                            } else {
                                if (nextMatch.awayTeam.id === 'TBD') nextMatch.awayTeam = winner;
                            }
                        }
                    }
                });
            };

            processRound(updatedKnockoutMatches.quarters, updatedKnockoutMatches.semis, 'semis');
            processRound(updatedKnockoutMatches.semis, [updatedKnockoutMatches.final], 'final');

            setKnockoutMatches(updatedKnockoutMatches);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [knockoutMatches.quarters, knockoutMatches.semis, knockoutMatches.final, stage]);


    const openModal = (match: Match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const groupStageComplete = useMemo(() => matches.every(m => m.played), [matches]);

    const handleAdvanceToKnockouts = () => {
        const qualifiers = determineKnockoutQualifiers(standings, groups);
        const bracket = generateKnockoutBracket(qualifiers);
        setKnockoutMatches(bracket);
        setStage(TournamentStage.KNOCKOUT_STAGE);
    };

    const winner = useMemo(() => {
        const final = knockoutMatches.final;
        if (final && final.played) {
            return final.homeScore > final.awayScore ? final.homeTeam : final.awayTeam;
        }
        return null;
    }, [knockoutMatches.final]);


    const renderContent = () => {
        switch (stage) {
            case TournamentStage.REGISTRATION:
                return (
                    <div className="text-center max-w-md mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-cyan-400">Player Registration</h2>
                        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                placeholder="Enter player name"
                                className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                disabled={players.length >= MAX_PLAYERS}
                            />
                            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 rounded-lg px-6 py-2 font-semibold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={players.length >= MAX_PLAYERS}>
                                Add
                            </button>
                        </form>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-[200px]">
                            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2"><UsersIcon /> Players ({players.length}/{MAX_PLAYERS})</h3>
                            <ul className="grid grid-cols-3 gap-2 text-center">
                                {players.map(p => <li key={p.id} className="bg-gray-700 rounded p-2 text-sm truncate">{p.name}</li>)}
                                {players.length < MAX_PLAYERS && Array(MAX_PLAYERS - players.length).fill(0).map((_, i) => <li key={`empty-${i}`} className="bg-gray-700/50 rounded p-2 text-sm text-gray-500 italic">Empty Slot</li>)}
                            </ul>
                        </div>
                        {players.length === MAX_PLAYERS && (
                            <button onClick={startTournament} className="mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105 w-full flex items-center justify-center gap-2">
                                Start Tournament <ArrowRightIcon />
                            </button>
                        )}
                    </div>
                );
            case TournamentStage.GROUP_STAGE:
                return (
                    <div>
                        <GroupStageView groups={groups} standings={standings} matches={matches} onMatchClick={openModal} />
                        {groupStageComplete && (
                            <div className="text-center mt-8">
                                 <button onClick={handleAdvanceToKnockouts} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 mx-auto">
                                    Proceed to Knockout Stage <ArrowRightIcon />
                                 </button>
                            </div>
                        )}
                    </div>
                );
            case TournamentStage.KNOCKOUT_STAGE:
                if (winner) {
                     return (
                        <div className="text-center flex flex-col items-center justify-center h-full">
                            <TrophyIcon className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                            <h2 className="text-5xl font-bold mt-4 text-yellow-300">Tournament Champion!</h2>
                            <p className="text-7xl font-extrabold mt-2 text-white bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                                {winner.name}
                            </p>
                             <button onClick={() => window.location.reload()} className="mt-12 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg">
                                Start New Tournament
                            </button>
                        </div>
                    );
                }
                return (
                     <div>
                        <h2 className="text-4xl font-bold text-center mb-8 text-cyan-400">Knockout Stage</h2>
                        <KnockoutBracket bracket={knockoutMatches} onMatchClick={openModal} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                        PES Tournament Manager
                    </h1>
                    <p className="text-gray-400 mt-2">15 Players | 2 Laptops | 1 Champion</p>
                </header>
                <main className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 sm:p-8 shadow-2xl shadow-cyan-500/10">
                    {renderContent()}
                </main>
            </div>
            {isModalOpen && selectedMatch && (
                <ScoreModal
                    match={selectedMatch}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleUpdateScore}
                    isKnockout={stage === TournamentStage.KNOCKOUT_STAGE}
                />
            )}
        </div>
    );
};

export default App;
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
