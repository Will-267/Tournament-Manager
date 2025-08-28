
import React from 'react';
import { KnockoutMatch, Match, Player } from '../types';

interface KnockoutBracketProps {
    bracket: KnockoutMatch;
    onMatchClick: (match: Match) => void;
}

const MatchCard: React.FC<{ match: Match | null; onMatchClick: (match: Match) => void; round: string }> = ({ match, onMatchClick, round }) => {
    const isClickable = match && !match.played && match.homeTeam.id !== 'TBD' && match.awayTeam.id !== 'TBD';
    
    const getPlayerName = (player: Player) => player.id === 'TBD' ? '...' : player.name;
    const getPlayerClasses = (player: Player, score: number | null, otherScore: number | null) => {
        let classes = "flex-1 px-3 py-1 truncate";
        if (match && match.played && score !== null && otherScore !== null) {
            if (score > otherScore) classes += " font-bold text-white";
            else classes += " text-gray-400";
        } else {
             classes += " text-gray-200";
        }
        return classes;
    };

    return (
        <div className={`bg-gray-700/80 rounded-lg w-full ${isClickable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : 'cursor-default'}`} onClick={() => isClickable && onMatchClick(match!)}>
            <div className="flex items-center text-sm">
                <span className={getPlayerClasses(match?.homeTeam!, match?.homeScore!, match?.awayScore!)}>{getPlayerName(match?.homeTeam!)}</span>
                <span className={`px-2 py-1 rounded-md font-bold ${match?.played ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                    {match?.played ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
                </span>
                <span className={getPlayerClasses(match?.awayTeam!, match?.awayScore!, match?.homeScore!)}>{getPlayerName(match?.awayTeam!)}</span>
            </div>
        </div>
    );
};

const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ bracket, onMatchClick }) => {
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
        </div>
    );
};

export default KnockoutBracket;
