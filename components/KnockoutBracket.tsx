
import React from 'react';
import { KnockoutMatch, Match, Player } from '../types';

interface KnockoutBracketProps {
    bracket: KnockoutMatch;
    onMatchClick: (match: Match) => void;
}

<<<<<<< HEAD
const MatchCard: React.FC<{ match: Match | null; onMatchClick: (match: Match) => void; }> = ({ match, onMatchClick }) => {
    if (!match) return <div className="bg-gray-700/80 rounded-lg w-full h-[36px]"></div>;

    const isClickable = !match.played && match.homeTeam.id !== 'TBD' && match.awayTeam.id !== 'TBD';
=======
const MatchCard: React.FC<{ match: Match | null; onMatchClick: (match: Match) => void; round: string }> = ({ match, onMatchClick, round }) => {
    const isClickable = match && !match.played && match.homeTeam.id !== 'TBD' && match.awayTeam.id !== 'TBD';
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
    
    const getPlayerName = (player: Player) => player.id === 'TBD' ? '...' : player.name;
    const getPlayerClasses = (player: Player, score: number | null, otherScore: number | null) => {
        let classes = "flex-1 px-3 py-1 truncate";
        if (match && match.played && score !== null && otherScore !== null) {
            if (score > otherScore) classes += " font-bold text-white";
            else classes += " text-gray-400";
        } else {
             classes += " text-gray-200";
        }
<<<<<<< HEAD
        if (player.id === 'TBD') classes += " italic";
=======
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
        return classes;
    };

    return (
<<<<<<< HEAD
        <div className={`bg-gray-700/80 rounded-lg w-full min-w-[200px] ${isClickable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : 'cursor-default'}`} onClick={() => isClickable && onMatchClick(match)}>
            <div className="flex items-center text-sm">
                <span className={getPlayerClasses(match.homeTeam, match.homeScore, match.awayScore)} title={getPlayerName(match.homeTeam)}>{getPlayerName(match.homeTeam)}</span>
                <span className={`px-2 py-1 rounded-md font-bold text-xs ${match.played ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                    {match.played ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
                </span>
                <span className={getPlayerClasses(match.awayTeam, match.awayScore, match.homeScore)} title={getPlayerName(match.awayTeam)}>{getPlayerName(match.awayTeam)}</span>
=======
        <div className={`bg-gray-700/80 rounded-lg w-full ${isClickable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : 'cursor-default'}`} onClick={() => isClickable && onMatchClick(match!)}>
            <div className="flex items-center text-sm">
                <span className={getPlayerClasses(match?.homeTeam!, match?.homeScore!, match?.awayScore!)}>{getPlayerName(match?.homeTeam!)}</span>
                <span className={`px-2 py-1 rounded-md font-bold ${match?.played ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                    {match?.played ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
                </span>
                <span className={getPlayerClasses(match?.awayTeam!, match?.awayScore!, match?.homeScore!)}>{getPlayerName(match?.awayTeam!)}</span>
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
            </div>
        </div>
    );
};

const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ bracket, onMatchClick }) => {
<<<<<<< HEAD
    const { rounds = [] } = bracket;

    if (rounds.length === 0) {
        return <p>Knockout bracket will be generated once the group stage is complete.</p>;
    }
    
    return (
        <div className="flex space-x-4 md:space-x-8 overflow-x-auto pb-4">
            {rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="flex flex-col flex-shrink-0">
                    <h3 className="text-xl font-bold mb-4 text-cyan-400 text-center">{round[0]?.round || `Round ${roundIndex + 1}`}</h3>
                    <div className={`flex flex-col gap-8 justify-around h-full`}>
                        {round.map((match, matchIndex) => (
                            <MatchCard key={match ? match.id : `empty-r${roundIndex}-m${matchIndex}`} match={match} onMatchClick={onMatchClick} />
                        ))}
                    </div>
                </div>
            ))}
=======
    const { quarters = [], semis = [], final = null } = bracket;

    const renderRound = (matches: (Match | null)[], title: string) => (
        <div className="flex flex-col items-center justify-around w-full">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">{title}</h3>
            <div className="flex flex-col gap-8 w-full">
                {matches.map((match, index) => (
                    <MatchCard key={match ? match.id : `empty-${title}-${index}`} match={match} onMatchClick={onMatchClick} round={title} />
                ))}
            </div>
        </div>
    );
    
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 md:gap-8 text-center text-xs w-full overflow-x-auto p-4">
           {renderRound(quarters, 'Quarter-Finals')}
           <div className="hidden md:flex items-center h-[400px]">
                <div className="border-r-2 border-gray-600 h-full"></div>
           </div>
           {renderRound(semis, 'Semi-Finals')}
           <div className="hidden md:flex items-center h-[400px]">
                 <div className="border-r-2 border-gray-600 h-full"></div>
           </div>
           {renderRound(final ? [final] : [], 'Final')}
>>>>>>> 495f5ad652e8e0d43ca046f9620b6fec77e37f38
        </div>
    );
};

export default KnockoutBracket;
