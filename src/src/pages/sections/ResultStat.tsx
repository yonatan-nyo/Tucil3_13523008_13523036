import { Clock, HardDrive, MoveHorizontal } from "lucide-react";
import type { Stats } from "../../lib/types";

const ResultStat = ({ stats, isDarkMode }: { stats: Stats; isDarkMode: boolean }) => {
  return (
    <div className={`mt-6 ${isDarkMode ? "bg-blue-900/30 border-blue-800" : "bg-blue-50 border-blue-200"} border p-4 rounded-md`}>
      <h3 className="font-bold text-lg mb-2">Results</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center">
          <HardDrive className={`${isDarkMode ? "text-blue-400" : "text-blue-600"} mr-2`} size={20} />
          <div>
            <div className="text-sm opacity-75">Nodes Visited</div>
            <div className="font-bold text-xl">{stats.nodesVisited.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center">
          <Clock className={`${isDarkMode ? "text-blue-400" : "text-blue-600"} mr-2`} size={20} />
          <div>
            <div className="text-sm opacity-75">Execution Time</div>
            <div className="font-bold text-xl">{stats.executionTime} ms</div>
          </div>
        </div>

        <div className="flex items-center">
          <MoveHorizontal className={`${isDarkMode ? "text-blue-400" : "text-blue-600"} mr-2`} size={20} />
          <div>
            <div className="text-sm opacity-75">Solution Moves</div>
            <div className="font-bold text-xl">{stats.moves}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultStat;
