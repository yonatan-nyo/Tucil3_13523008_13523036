import { useState } from "react";
import { Github, Linkedin } from "lucide-react";
import Layout from "./components/Layout";

export default function About() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
  };

  const teamMembers = [
    {
      name: "Varel Tiara",
      id: "13523008",
      image: "/Varel.png",
      github: "https://github.com/varel183",
      linkedin: "https://www.linkedin.com/in/varel-tiara/",
    },
    {
      name: "Yonatan Edward Njoto",
      id: "13523036",
      image: "/Yonatan.png",
      github: "https://github.com/yonatan-nyo",
      linkedin: "https://www.linkedin.com/in/yonatan-njoto/",
    },
  ];

  return (
    <Layout>
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        } transition-colors duration-300`}>
        {/* Header Section */}
        <div className={`${isDarkMode ? "bg-blue-800" : "bg-blue-600"} text-white transition-colors duration-300`}>
          <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Rush Hour Game Solver</h1>
            <p className="text-xl md:text-2xl mb-8">Solving Rush Hour Puzzles with Pathfinding Algorithms</p>
            <div
              className={`inline-block ${
                isDarkMode ? "bg-gray-800 text-blue-300" : "bg-white text-blue-700"
              } font-semibold px-6 py-3 rounded-md shadow-md`}>
              Tugas Kecil 3 IF2211 Strategi Algoritma
            </div>
            <button
              onClick={toggleDarkMode}
              className={`absolute top-20 right-4 p-2 rounded-full ${
                isDarkMode ? "bg-yellow-400 text-gray-900" : "bg-gray-800 text-white"
              }`}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="container mx-auto px-6 py-16">
          <h2 className={`text-3xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-800"} mb-12`}>Meet Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105`}>
                <div className={`h-48 ${isDarkMode ? "bg-blue-800" : "bg-blue-500"} flex items-center justify-center`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/150?text=Profile";
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3 className={`font-bold text-xl ${isDarkMode ? "text-white" : "text-gray-800"} mb-2 sm:mb-0`}>
                      {member.name}
                    </h3>
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>{member.id}</p>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isDarkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"
                      } transition-colors`}>
                      <Github size={24} />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${
                        isDarkMode ? "text-gray-300 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"
                      } transition-colors`}>
                      <Linkedin size={24} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Details Section */}
        <div className={isDarkMode ? "bg-gray-800" : "bg-white"}>
          <div className="container mx-auto px-6 py-16">
            <div className="w-full mx-auto">
              <h2 className={`text-3xl font-bold text-center ${isDarkMode ? "text-white" : "text-gray-800"} mb-8`}>
                About the Project
              </h2>

              <div className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"} rounded-xl p-8 shadow-md max-w-4xl mx-auto`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  Pathfinding Algorithms for Rush Hour Game Solving
                </h3>

                <div className={`space-y-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <p>
                    This project implements various pathfinding algorithms to solve Rush Hour puzzles. Rush Hour is a grid-based
                    logic puzzle that challenges players to slide vehicles within a box (typically 6x6) so that the main car
                    (usually red) can exit through an opening on the side of the board. Each vehicle can only move straight
                    forward or backward according to its orientation (horizontal or vertical), and cannot rotate. The main goal is
                    to move the red car to the exit with the minimum number of moves.
                  </p>

                  <div className="py-2">
                    <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-2`}>Course Information:</h4>
                    <p>Tugas Kecil 3 - Strategi Algoritma (IF2211)</p>
                    <p>Semester 4, Academic Year 2023/2024</p>
                  </div>

                  <div className="py-4">
                    <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-3`}>
                      Implemented Algorithms:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
                        <h5 className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-2`}>
                          Greedy Best First Search
                        </h5>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Uses heuristic function to estimate the cost from current state to goal, always expanding the node that
                          appears closest to the goal.
                        </p>
                      </div>
                      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
                        <h5 className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-2`}>
                          Uniform Cost Search (UCS)
                        </h5>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Explores nodes with the lowest path cost first, ensuring the optimal solution is found.
                        </p>
                      </div>
                      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
                        <h5 className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-2`}>A* (A-Star)</h5>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Combines path cost and heuristic estimation to find the most efficient path to the goal.
                        </p>
                      </div>
                      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
                        <h5 className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-2`}>
                          Dijkstra's Algorithm
                        </h5>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Alternative approach that finds the shortest path by considering the cumulative cost of moves.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-4">
                    <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-3`}>Heuristic Functions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
                        <h5 className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-2`}>
                          Manhattan Distance
                        </h5>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Measures the grid distance between the primary vehicle and the exit.
                        </p>
                      </div>
                      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
                        <h5 className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-2`}>Blocking Vehicle</h5>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Counts the number of vehicles blocking the primary vehicle's path to the exit.
                        </p>
                      </div>
                      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow`}>
                        <h5 className={`font-medium ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-2`}>
                          Combined Heuristic
                        </h5>
                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Uses a weighted combination of Manhattan distance and blocking vehicle count for improved estimations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-800"} mb-2`}>Main Features:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Multiple pathfinding algorithms for comparison</li>
                      <li>Different heuristic functions for optimized solving</li>
                      <li>Interactive visualization of the solution path</li>
                      <li>Step-by-step solution playback</li>
                      <li>Performance metrics tracking (nodes expanded, time taken)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
