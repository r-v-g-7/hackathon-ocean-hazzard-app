import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";
import ReportSidebar from "./components/ReportSidebar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hazardCounts, setHazardCounts] = useState({
    cyclone: 2,
    flood: 4,
    pollution: 1,
  });
  const [isOnline, setIsOnline] = useState(true);

  // Mock real-time hazard updates (prototype simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const hazards = ["cyclone", "flood", "pollution"];
        const randomHazard = hazards[Math.floor(Math.random() * hazards.length)];
        setHazardCounts((prev) => ({
          ...prev,
          [randomHazard]: prev[randomHazard] + 1,
        }));
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Detect online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <MapView />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-blue-900/90 text-white backdrop-blur-md border-b border-blue-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌊</span>
            <h1 className="text-lg font-bold">Ocean Hazard Watch</h1>
          </div>

          {/* Online/Offline Status */}
          <div
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${isOnline
              ? "bg-green-100 text-green-900"
              : "bg-red-100 text-red-900"
              }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            <span>{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>

      {/* Hazard Quick Action Buttons */}
      <div className="absolute top-20 left-4 right-4 z-30">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-3">
          <div className="flex space-x-2 overflow-x-auto">
            <button
              className="flex-shrink-0 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              🌀 Report Cyclone
            </button>
            <button
              className="flex-shrink-0 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              🌊 Report Flood/Tsunami
            </button>
            <button
              className="flex-shrink-0 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              🛢️ Report Oil Spill
            </button>
            <button
              className="flex-shrink-0 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200"
              onClick={() => setIsSidebarOpen(true)}
            >
              🚩 Other Hazard
            </button>
          </div>
        </div>
      </div>

      {/* Active Hazards Overview */}
      <div className="absolute bottom-32 left-4 z-30 bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-3 w-60">
        <div className="font-semibold text-gray-800 mb-2">Active Hazards</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>🌀 Cyclones</span>
            <span className="font-bold text-red-600">{hazardCounts.cyclone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🌊 Floods</span>
            <span className="font-bold text-blue-600">{hazardCounts.flood}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>🛢️ Pollution</span>
            <span className="font-bold text-yellow-600">{hazardCounts.pollution}</span>
          </div>
        </div>
      </div>

      {/* Floating Report Button */}
      <button
        className="absolute bottom-6 right-6 z-30 bg-red-600 text-white px-6 py-4 rounded-full shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 animate-pulse"
        onClick={() => setIsSidebarOpen(true)}
      >
        <span className="text-lg">📢</span>
        <span className="font-medium">Report Hazard</span>
      </button>

      {/* Sidebar for Reporting Hazards */}
      <ReportSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}

export default App;
