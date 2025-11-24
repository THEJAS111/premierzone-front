import React, { useState, useEffect } from 'react';
import PremSymbolImage from '../assets/premsymbol.jpg'
import { useNavigate } from 'react-router-dom';

// --- SVG Icon Components ---

// The official Premier League icon
const PremleagueIcon = ({ className, alt = "Premier League Symbol" }) => {
  return (
    <img
      src={PremSymbolImage} // ⬅️ Use the imported image variable here
      alt={alt}
      className={className} // ⬅️ Apply the className for styling
    />
  );
};



// --- Main App Component (Starting Page) ---
export default function Startpage() {
  const [isAnimating, setIsAnimating] = useState(false);
   const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/homepage');
  };

  useEffect(() => {
    // Start animation shortly after component mounts
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 100); // 100ms delay to ensure elements are rendered before transition starts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-1cf9fa24a5f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-gray-900"></div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header/Navigation */}
        <header className={`py-4 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold tracking-tighter">PL Stats Hub</h1>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
            {/* Hero Section */}
            <section className="py-20 sm:py-32">
              <div className="max-w-4xl mx-auto">
                {/* Animated Premier League Icon */}
                <PremleagueIcon className={`
                    w-84 h-84 md:w-44 md:h-44 mx-auto mb-8 text-purple-400
                    transform transition-all duration-1000 ease-in-out
                    ${isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-[200%] opacity-0'}
                `} />
                
                <h2 className={`
                    text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500
                    transform transition-all duration-700 ease-in-out delay-300
                    ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                `}>
                  The Ultimate Premier League Experience
                </h2>
                <p className={`
                    mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto
                    transform transition-all duration-700 ease-in-out delay-500
                    ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                `}>
                  Dive deep into the stats. Track your favorite players and teams with real-time data, performance metrics, and in-depth analysis.
                </p>
                <div className={`
                    mt-10 flex justify-center gap-4
                    transform transition-all duration-700 ease-in-out delay-700
                    ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                `}>
                   <button 
              className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20"
              onClick={handleGetStarted}
              >
              Get Started
                </button>
                </div>
              </div>
            </section>
        </main>
        
        {/* Footer */}
        <footer className={`text-center py-6 text-gray-500 text-sm transition-opacity duration-700 delay-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <p>&copy; {new Date().getFullYear()} Premier League Stats Hub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

