const HomeHead = ({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean; toggleDarkMode: () => void }) => {
  return (
    <header className="mb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="text-blue-500">Rush Hour</span> Game Solver
        </h1>
        <button onClick={toggleDarkMode} className={`p-2 rounded-full ${isDarkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"}`}>
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
      <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>A pathfinding solution for the classic Rush Hour puzzle game</p>
    </header>
  );
};

export default HomeHead;
