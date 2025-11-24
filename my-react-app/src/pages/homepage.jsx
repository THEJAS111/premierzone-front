import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = "http://localhost:8080/api/v1ap/player";

// Premier League team symbols mapping
const PREMIER_LEAGUE_SYMBOLS = {
  "Arsenal": "🔴",
  "Aston Villa": "🦁",
  "Bournemouth": "🍒",
  "Brentford": "🐝",
  "Brighton": "⚡",
  "Chelsea": "🔵",
  "Crystal Palace": "🦅",
  "Everton": "🔵",
  "Fulham": "⚪",
  "Leeds": "⚪",
  "Leicester City": "🦊",
  "Liverpool": "🔴",
  "Manchester City": "🌙",
  "Manchester United": "😈",
  "Newcastle United": "⚫",
  "Nottingham Forest": "🌳",
  "Southampton": "🔴",
  "Tottenham": "⚪",
  "West Ham": "⚒️",
  "Wolves": "🐺"
};

// --- Utility Components (Icons & Loading) ---

const LoadingSpinner = ({ teamName = 'data' }) => (
    <div className="flex justify-center items-center py-10">
        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-400">Fetching {teamName}...</span>
    </div>
);

const Alert = ({ message, type = 'error' }) => {
    const baseStyle = "p-4 rounded-lg text-sm font-medium flex items-start";
    const style = type === 'error' 
        ? "bg-red-900/40 text-red-300 border border-red-700"
        : "bg-blue-900/40 text-blue-300 border border-blue-700";
    
    return (
        <div className={`${baseStyle} ${style} mx-auto max-w-2xl mt-4`}>
            {type === 'error' ? <span className="mr-3 mt-0.5 text-lg">🚨</span> : <span className="mr-3 mt-0.5 text-lg">ℹ️</span>}
            <p>{message}</p>
        </div>
    );
};

// --- Main Homepage Component ---

export default function Homepage() {
    const navigate = useNavigate(); 
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Get team symbol with fallback
    const getTeamSymbol = (teamName) => {
        return PREMIER_LEAGUE_SYMBOLS[teamName] || "⚽";
    };

    // --- Data Fetching Logic ---
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                const allPlayers = response.data;
                const uniqueTeams = [...new Set(allPlayers.map(player => player.team))].sort();
                setTeams(uniqueTeams);
            } catch (err) {
                console.error("Error fetching teams:", err);
                setError("Failed to load team list. Check API connection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            const fetchPlayers = async () => {
                setIsLoading(true);
                setTeamPlayers([]);
                setFilteredPlayers([]);
                setError(null);
                setSearchQuery(""); // Reset search when team changes
                try {
                    const response = await axios.get(`${API_BASE_URL}?team=${selectedTeam}`);
                    setTeamPlayers(response.data);
                    setFilteredPlayers(response.data);
                } catch (err) {
                    console.error(`Error fetching players for ${selectedTeam}:`, err);
                    setError(`Could not fetch players for ${selectedTeam}. Data might be incomplete.`);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPlayers();
        }
    }, [selectedTeam]);

    // --- Search Functionality ---
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredPlayers(teamPlayers);
        } else {
            const query = searchQuery.toLowerCase().trim();
            const filtered = teamPlayers.filter(player => 
                player.name?.toLowerCase().includes(query) ||
                player.pos?.toLowerCase().includes(query) ||
                player.nation?.toLowerCase().includes(query)
            );
            setFilteredPlayers(filtered);
        }
    }, [searchQuery, teamPlayers]);

    // --- Event Handlers ---
    const handleTeamClick = (teamName) => {
        setSelectedTeam(teamName);
    };

    const handlePlayerClick = (player) => {
        const encodedName = encodeURIComponent(player.name); 
        navigate(`/playerdetails/${encodedName}`, { 
            state: { player: player }
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    // --- Calculations ---
    const totalPlayers = filteredPlayers.length;
    const teamStats = totalPlayers > 0 ? {
        averageAge: (filteredPlayers.reduce((sum, p) => sum + (p.age || 0), 0) / totalPlayers).toFixed(1),
        totalGoals: filteredPlayers.reduce((sum, p) => sum + (p.gls || 0), 0),
        positionCounts: filteredPlayers.reduce((acc, p) => {
            const pos = p.pos || 'Unknown';
            acc[pos] = (acc[pos] || 0) + 1;
            return acc;
        }, {}),
    } : {};

    // --- Render Logic ---
    if (isLoading && teams.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <LoadingSpinner teamName="teams" />
            </div>
        );
    }
    if (error && teams.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 p-8">
                <Alert message={error} type="error" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans antialiased p-4 md:p-8">
            
            {/* Header */}
            <header className="max-w-7xl mx-auto pt-4 pb-8 mb-6 border-b border-gray-700">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    <span role="img" aria-label="premier league" className="mr-2">🏆</span>Premier League Data Hub
                </h1>
                <p className="text-center text-gray-400 mt-2 text-lg">In-depth Rosters and Metrics for the Top Flight</p>
            </header>

            <div className="max-w-7xl mx-auto">
                
                {/* Team Selection Bar */}
                <TeamSelectionBar 
                    teams={teams}
                    selectedTeam={selectedTeam}
                    onTeamClick={handleTeamClick}
                    getTeamSymbol={getTeamSymbol}
                />

                {/* Team Details Section */}
                <TeamDetailsSection 
                    selectedTeam={selectedTeam}
                    isLoading={isLoading}
                    error={error}
                    teamPlayers={filteredPlayers}
                    teamStats={teamStats}
                    totalPlayers={totalPlayers}
                    onPlayerClick={handlePlayerClick}
                    getTeamSymbol={getTeamSymbol}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onClearSearch={clearSearch}
                    originalPlayerCount={teamPlayers.length}
                />
            </div>
        </div>
    );
}

// --- Team Selection Bar Component ---
const TeamSelectionBar = ({ teams, selectedTeam, onTeamClick, getTeamSymbol }) => (
    <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-xl mb-8 border border-gray-700">
        <h2 className="text-xl font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">
            Premier League Teams ({teams.length})
        </h2>
        <div className="flex overflow-x-auto pb-2 space-x-3 scrollbar-hide"> 
            {teams.map((team) => (
                <TeamButton
                    key={team}
                    team={team}
                    isSelected={team === selectedTeam}
                    onClick={onTeamClick}
                    symbol={getTeamSymbol(team)}
                />
            ))}
        </div>
    </div>
);

// --- Team Button Component ---
const TeamButton = ({ team, isSelected, onClick, symbol }) => (
    <button
        className={`
            flex items-center flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition duration-200 ease-in-out whitespace-nowrap
            ${isSelected
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }
        `}
        onClick={() => onClick(team)}
    >
        <span className="mr-2 text-base">{symbol}</span>
        {team}
    </button>
);

// --- Team Details Section Component ---
const TeamDetailsSection = ({ 
    selectedTeam, 
    isLoading, 
    error, 
    teamPlayers, 
    teamStats, 
    totalPlayers, 
    onPlayerClick,
    getTeamSymbol,
    searchQuery,
    onSearchChange,
    onClearSearch,
    originalPlayerCount
}) => (
    <div className="bg-gray-800/80 p-6 rounded-xl shadow-2xl border border-gray-700">
        {!selectedTeam ? (
            <TeamSelectionPrompt />
        ) : (
            <>
                <TeamHeader 
                    team={selectedTeam} 
                    symbol={getTeamSymbol(selectedTeam)} 
                />

                {isLoading ? (
                    <LoadingSpinner teamName={`players for ${selectedTeam}`} />
                ) : error ? (
                    <Alert message={error} type="error" />
                ) : (
                    <>
                        <SearchBar 
                            searchQuery={searchQuery}
                            onSearchChange={onSearchChange}
                            onClearSearch={onClearSearch}
                            resultCount={totalPlayers}
                            totalCount={originalPlayerCount}
                        />
                        
                        <TeamStatsCards 
                            teamStats={teamStats}
                            totalPlayers={totalPlayers}
                        />
                        
                        <PlayerRosterTable 
                            teamPlayers={teamPlayers}
                            onPlayerClick={onPlayerClick}
                            searchQuery={searchQuery}
                        />
                    </>
                )}
            </>
        )}
    </div>
);

// --- Search Bar Component ---
const SearchBar = ({ searchQuery, onSearchChange, onClearSearch, resultCount, totalCount }) => (
    <div className="mb-6">
        <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search players by name, position, or nationality..."
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            />
            {searchQuery && (
                <button
                    onClick={onClearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition duration-200"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
        {searchQuery && (
            <p className="text-sm text-gray-400 mt-2">
                Showing {resultCount} of {totalCount} players
                {resultCount === 0 && " - No matches found"}
            </p>
        )}
    </div>
);

// --- Team Selection Prompt Component ---
const TeamSelectionPrompt = () => (
    <div className="text-center py-20">
        <span className="text-6xl mb-4 block">⚽</span>
        <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Select any Premier League team above to instantly load their <strong>full squad roster</strong> and <strong>performance statistics</strong>.
        </p>
    </div>
);

// --- Team Header Component ---
const TeamHeader = ({ team, symbol }) => (
    <h2 className="text-3xl font-bold text-gray-100 mb-6 border-b border-purple-700 pb-3">
        {symbol} {team} - Squad Analytics
    </h2>
);

// --- Team Stats Cards Component ---
const TeamStatsCards = ({ teamStats, totalPlayers }) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="Squad Size" 
            value={totalPlayers} 
            icon="👥" 
            color="bg-purple-600/20 text-purple-300 border-purple-500"
        />
        <StatCard 
            title="Total Goals" 
            value={teamStats.totalGoals || 0} 
            icon="🥅" 
            color="bg-pink-600/20 text-pink-300 border-pink-500"
        />
        <StatCard 
            title="Average Age" 
            value={teamStats.averageAge || 'N/A'} 
            icon="🕰️" 
            color="bg-teal-600/20 text-teal-300 border-teal-500"
            unit="Yrs"
        />
        <StatCard 
            title="Key Position" 
            value={Object.keys(teamStats.positionCounts || {}).sort((a, b) => teamStats.positionCounts[b] - teamStats.positionCounts[a])[0] || 'N/A'}
            icon="⭐️"
            color="bg-amber-600/20 text-amber-300 border-amber-500"
            unit=""
            isTextValue={true}
        />
    </div>
);

// --- Player Roster Table Component ---
const PlayerRosterTable = ({ teamPlayers, onPlayerClick, searchQuery }) => {
    const totalPlayers = teamPlayers.length;

    if (totalPlayers === 0) {
        return (
            <div className="text-center py-10">
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-xl text-gray-400">
                    {searchQuery ? "No players found matching your search criteria." : "No detailed player data found for this team."}
                </p>
                {searchQuery && (
                    <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
                )}
            </div>
        );
    }

    return (
        <>
            <h3 className="text-2xl font-semibold text-gray-200 mt-10 mb-4 border-b border-gray-700 pb-2">
                Roster Details 
                <span className="text-sm text-gray-500 ml-2">(Click player for full profile)</span>
            </h3>
            
            <div className="overflow-x-auto shadow-xl rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/70">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Player</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">Nationality</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Goals</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                        {teamPlayers.map((player, index) => (
                            <PlayerRow 
                                key={index}
                                player={player}
                                onClick={onPlayerClick}
                                searchQuery={searchQuery}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// --- Player Row Component ---
const PlayerRow = ({ player, onClick, searchQuery }) => {
    // Safe nation display with null/undefined checking
    const getNationality = (nation) => {
        if (!nation) return 'Unknown';
        
        // If nation is a string with spaces, take the last part (country code/name)
        if (typeof nation === 'string' && nation.includes(' ')) {
            return nation.split(' ').pop() || nation;
        }
        
        return nation;
    };

    // Highlight search matches in player names
    const highlightMatch = (text, query) => {
        if (!query || !text) return text;
        
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);
        
        if (index === -1) return text;
        
        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);
        
        return (
            <>
                {before}
                <mark className="bg-yellow-500/30 text-yellow-200 px-1 rounded">{match}</mark>
                {after}
            </>
        );
    };

    return (
        <tr 
            className="hover:bg-gray-700/50 cursor-pointer transition duration-150 group"
            onClick={() => onClick(player)}
        >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-400 group-hover:text-pink-300">
                {searchQuery ? highlightMatch(player.name || 'Unknown Player', searchQuery) : (player.name || 'Unknown Player')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {player.pos || 'Unknown'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                {getNationality(player.nation)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-right">
                {player.age || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-400 font-bold text-right">
                {player.gls || 0}
            </td>
        </tr>
    );
};

// --- Stat Card Component ---
const StatCard = ({ title, value, icon, color, unit = '', isTextValue = false }) => (
    <div className={`p-5 rounded-xl shadow-xl border-l-4 ${color} transition-transform duration-300 hover:scale-[1.02] flex items-center justify-between`}>
        <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            {isTextValue ? (
                 <p className="text-2xl font-extrabold text-white mt-1 uppercase truncate">{value}</p>
            ) : (
                <div className="flex items-baseline mt-1">
                    <p className="text-4xl font-extrabold text-white">{value}</p>
                    {unit && <span className="ml-2 text-md text-gray-400">{unit}</span>}
                </div>
            )}
        </div>
        <span className="text-4xl opacity-70">{icon}</span>
    </div>
);