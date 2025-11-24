import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';

// --- Utility Components (Redesigned for Dark Theme) ---

// Reusable component for basic details (Stat Detail Card)
const StatDetailCard = ({ title, value, icon, color = 'purple' }) => {
    // Define base color classes for different types of stats
    const colorClasses = {
        purple: 'bg-purple-600/20 text-purple-300 border-purple-500',
        pink: 'bg-pink-600/20 text-pink-300 border-pink-500',
        green: 'bg-green-600/20 text-green-300 border-green-500',
        yellow: 'bg-yellow-600/20 text-yellow-300 border-yellow-500',
        cyan: 'bg-cyan-600/20 text-cyan-300 border-cyan-500',
    };
    const classes = colorClasses[color] || colorClasses.purple;

    return (
        <div className={`p-4 rounded-xl border-l-4 shadow-lg ${classes} flex items-center justify-between transition-shadow duration-300 hover:shadow-xl`}>
            <div>
                <p className="text-xs font-semibold uppercase opacity-80">{title}</p>
                {/* Check if value is a string (like Nation) or numeric */}
                <p className={`mt-1 font-bold ${typeof value === 'string' || isNaN(value) ? 'text-xl' : 'text-3xl'}`}>{value}</p>
            </div>
            {icon && <span className="text-3xl opacity-60">{icon}</span>}
        </div>
    );
};

// Reusable component for performance stat boxes (Prominent Stats)
const PerformanceStatBox = ({ title, value, color = 'red' }) => {
    const colorClasses = {
        red: 'bg-red-700 hover:bg-red-600',
        teal: 'bg-teal-700 hover:bg-teal-600',
        orange: 'bg-orange-700 hover:bg-orange-600',
        blue: 'bg-blue-700 hover:bg-blue-600',
    };
    const classes = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`p-4 text-white rounded-xl shadow-xl text-center ${classes} transition-all duration-300 transform hover:scale-[1.05] cursor-pointer`}>
            <p className="text-4xl font-extrabold">{value}</p>
            <p className="text-xs font-medium uppercase mt-1 opacity-90">{title}</p>
        </div>
    );
};

// --- Main PlayerDetails Component ---

export default function PlayerDetails() {
    const { playerName } = useParams(); 
    const location = useLocation(); 
    const player = location.state?.player;

    // --- Loading and Error Handling (Updated for Dark Theme) ---
    
    if (!player) {
        return (
            <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-white">
                <div className="max-w-xl mx-auto p-8 text-center bg-gray-800 shadow-2xl rounded-xl mt-10 border border-gray-700">
                    <h1 className="text-3xl font-bold text-red-400 mb-4">Player Details Not Found 😟</h1>
                    <p className="text-lg text-gray-400">
                        The detailed information for <span className="font-semibold text-gray-200">"{decodeURIComponent(playerName)}"</span> could not be loaded directly.
                    </p>
                    <p className="mt-4">
                        Please go back to the <Link to="/homepage" className="text-purple-400 hover:text-pink-400 underline font-medium transition duration-150">Homepage</Link> and select a team first.
                    </p>
                </div>
            </div>
        );
    }

    // --- Data Rendering (Updated for Dark Theme) ---

    // Extracting nation name without country code for cleaner UI
    const nationName = player.nation.split(' ')[1] || player.nation;

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-white">
            
            {/* Back Button */}
            <Link 
                to="/homepage" 
                className="inline-flex items-center text-gray-400 hover:text-purple-400 mb-6 font-medium transition duration-150 group"
            >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Team Roster
            </Link>

            {/* Main Content Card */}
            <div className="max-w-6xl mx-auto bg-gray-800/80 p-6 shadow-2xl rounded-xl border border-gray-700">
                
                {/* Header Section */}
                <div className="border-b border-gray-700 pb-4 mb-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        {player.name}
                    </h1>
                    <p className="text-xl text-gray-400 mt-1">{player.team} | <span className="font-semibold">{player.pos}</span></p>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">Core Information</h2>
                
                {/* Basic Details (Using StatDetailCard component) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatDetailCard title="Team" value={player.team} icon="⚽" color="purple" />
                    <StatDetailCard title="Position" value={player.pos} icon="📍" color="pink" />
                    <StatDetailCard title="Nation" value={nationName} icon="🌍" color="green" />
                    <StatDetailCard title="Age" value={`${player.age} yrs`} icon="🎂" color="yellow" />
                    <StatDetailCard title="Matches Played" value={player.mp} icon="⚔️" color="cyan" />
                    <StatDetailCard title="Minutes Played" value={player.min} icon="⏱️" color="purple" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-700 pb-2 mb-6 mt-8">Performance Statistics</h2>

                {/* Performance Stats Grid (Using PerformanceStatBox component) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <PerformanceStatBox title="Goals (Gls)" value={player.gls} color="red" />
                    <PerformanceStatBox title="Assists (Ast)" value={player.ast} color="teal" />
                    <PerformanceStatBox title="Expected Goals (xG)" value={player.xg} color="orange" />
                    <PerformanceStatBox title="Expected Assisted Goals (xAG)" value={player.xag} color="blue" />
                    <PerformanceStatBox title="Yellow Cards" value={player.crdy} color="yellow" />
                    <PerformanceStatBox title="Red Cards" value={player.crdr} color="red" />
                </div>

                <div className="mt-10 text-sm text-gray-500 italic border-t border-gray-700 pt-4">
                    <p>Statistics are based on accumulated data over **{player.mp}** matches played this season. Data source is reflective of the API provided.</p>
                </div>
            </div>
        </div>
    );
}