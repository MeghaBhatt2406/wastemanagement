// import { apiClient } from "@/lib/api-client";
// import { LEADERBOARD_DATA_ROUTE } from "@/utils/constant";
// import { Award, Crown, Loader, Trophy, User } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { useAppStore } from "@/store/store";
// import { useSettings } from '../contexts/SettingsContext';

// const LeaderBoard = () => {
//   const [rewards, setRewards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { settings } = useSettings();
//   const { userInfo } = useAppStore();

//   useEffect(() => {
//     const fetchLeaderBoard = async () => {
//       const response = await apiClient.get(LEADERBOARD_DATA_ROUTE);
//       if (response.status === 200 && response.data) {
//         setRewards(response.data);
//       }
//     };
//     fetchLeaderBoard();
//     setLoading(false);
//   }, []);

//   return (
//     <div className={settings.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>
//     <div className="box-border ">
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
//           Leaderboard
//         </h1>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <Loader className="animate-spin h-8 w-8 text-gray-600" />
//           </div>
//         ) : (
//           <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
//             <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6">
//               <div className="flex justify-between items-center text-white">
//                 <Trophy className="h-8 sm:h-10 w-8 sm:w-10" />
//                 <span className="text-lg sm:text-2xl font-bold">Top Performers</span>
//                 <Award className="h-8 sm:h-10 w-8 sm:w-10" />
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                       Rank
//                     </th>
//                     <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                       Points
//                     </th>
//                     <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                       Level
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rewards.map((reward, index) => (
//                     <tr
//                       key={reward.userInfo._id}
//                       className={`${
//                         reward.userInfo._id && userInfo._id === reward.userId ? "bg-indigo-50" : ""
//                       } hover:bg-gray-50 transition-colors duration-150 ease-in-out`}
//                     >
//                       <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {index < 3 ? (
//                             <Crown
//                               className={`h-5 sm:h-6 w-5 sm:w-6 ${
//                                 index === 0
//                                   ? "text-yellow-400"
//                                   : index === 1
//                                   ? "text-gray-400"
//                                   : "text-yellow-600"
//                               }`}
//                             />
//                           ) : (
//                             <span className="text-sm font-medium text-gray-900">
//                               {index + 1}
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10">
//                             <User className="h-full w-full rounded-full bg-gray-200 text-gray-500 p-2" />
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {reward.userInfo.name}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <Award className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-500 mr-2" />
//                           <div className="text-sm font-semibold text-gray-900">
//                             {reward.points}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
//                         <span className="px-2 sm:px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
//                           Level {reward.level}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
//   );
// };

import { apiClient } from "@/lib/api-client";
import { LEADERBOARD_DATA_ROUTE, GET_REPORTS_TO_COLLECT } from "@/utils/constant";
import { Award, Crown, Loader, Trophy, User, TrendingUp, MapPin, Calendar, BarChart3, PieChart, Share2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { useSettings } from '../contexts/SettingsContext';
import SocialShare from './SocialShare';

const LeaderBoard = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [wasteAnalytics, setWasteAnalytics] = useState({
    byLocation: [],
    byMonth: [],
    byQuarter: [],
    byYear: [],
    byWasteType: [],
    totalWaste: 0,
  });
  const { settings } = useSettings();
  const { userInfo } = useAppStore();

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      const response = await apiClient.get(LEADERBOARD_DATA_ROUTE);
      if (response.status === 200 && response.data) {
        setRewards(response.data);
      }
      setLoading(false);
    };
    fetchLeaderBoard();
  }, []);

  useEffect(() => {
    const fetchWasteAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        // Fetch all reports for analytics (using the same endpoint as collect page)
        const response = await apiClient.get(GET_REPORTS_TO_COLLECT, {
          withCredentials: true,
          params: { 
            skip: 0, 
            limit: 1000 // Fetch a large number for analytics
          }
        });
        
        if (response.data && response.data.reports && response.data.reports.length > 0) {
          const reports = response.data.reports;
          
          // Process analytics data
          const analytics = processWasteData(reports);
          setWasteAnalytics(analytics);
        } else {
          // Set empty analytics if no data
          setWasteAnalytics({
            byLocation: [],
            byMonth: [],
            byQuarter: [],
            byYear: [],
            byWasteType: [],
            totalWaste: 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch waste analytics:", error);
        setWasteAnalytics({
          byLocation: [],
          byMonth: [],
          byQuarter: [],
          byYear: [],
          byWasteType: [],
          totalWaste: 0,
        });
      } finally {
        setAnalyticsLoading(false);
      }
    };

    if (activeTab === "analytics") {
      fetchWasteAnalytics();
    }
  }, [activeTab]);

  const processWasteData = (reports) => {
    // Helper function to extract numeric value from amount string
    const extractAmount = (amountStr) => {
      if (!amountStr) return 0;
      // Handle formats like "10kg", "10 kg", "10.5kg", "10"
      const match = amountStr.toString().match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 0;
    };

    // Helper function to extract city from location
    const extractCity = (location) => {
      if (!location) return "Unknown";
      // Try to extract city from location string
      const parts = location.split(",").map(s => s.trim());
      // Usually city is in the middle of the address
      if (parts.length >= 3) {
        return parts[parts.length - 3] || parts[parts.length - 2] || "Unknown";
      } else if (parts.length >= 2) {
        return parts[parts.length - 2] || "Unknown";
      }
      return parts[0] || "Unknown";
    };

    // Calculate total waste
    let totalWaste = 0;
    reports.forEach(report => {
      totalWaste += extractAmount(report.amount);
    });

    // Group by location/city (case-insensitive)
    const locationMap = {};
    reports.forEach(report => {
      const rawCity = extractCity(report.location);
      const cityKey = rawCity.toLowerCase().trim();
      const amount = extractAmount(report.amount);
      
      if (!locationMap[cityKey]) {
        // Store with proper capitalization
        const displayCity = rawCity.trim().split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        locationMap[cityKey] = { 
          total: 0, 
          count: 0,
          displayName: displayCity 
        };
      }
      locationMap[cityKey].total += amount;
      locationMap[cityKey].count += 1;
    });

    const byLocation = Object.entries(locationMap)
      .map(([cityKey, data]) => ({
        location: data.displayName,
        amount: data.total,
        count: data.count,
        percentage: totalWaste > 0 ? ((data.total / totalWaste) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 locations

    // Group by waste type (case-insensitive)
    const wasteTypeMap = {};
    reports.forEach(report => {
      // Normalize waste type: trim, convert to lowercase for comparison, but keep proper case for display
      const rawType = report.wasteType || "Unknown";
      const normalizedType = rawType.trim();
      // Use lowercase as key for grouping, but store original case for display
      const typeKey = normalizedType.toLowerCase();
      const amount = extractAmount(report.amount);
      
      if (!wasteTypeMap[typeKey]) {
        // Store with proper capitalization (first letter uppercase)
        const displayType = normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1).toLowerCase();
        wasteTypeMap[typeKey] = { 
          total: 0, 
          count: 0,
          displayName: displayType 
        };
      }
      wasteTypeMap[typeKey].total += amount;
      wasteTypeMap[typeKey].count += 1;
    });

    const byWasteType = Object.entries(wasteTypeMap)
      .map(([typeKey, data]) => ({
        type: data.displayName, // Use the properly formatted display name
        amount: data.total,
        count: data.count,
        percentage: totalWaste > 0 ? ((data.total / totalWaste) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Group by month
    const monthMap = {};
    reports.forEach(report => {
      // Use the date field from the report
      const dateStr = report.date || report.createdAt;
      const date = new Date(dateStr);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      const amount = extractAmount(report.amount);
      
      if (!monthMap[monthYear]) {
        monthMap[monthYear] = { total: 0, count: 0 };
      }
      monthMap[monthYear].total += amount;
      monthMap[monthYear].count += 1;
    });

    const byMonth = Object.entries(monthMap)
      .map(([month, data]) => ({
        period: month,
        amount: data.total,
        count: data.count,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.period);
        const dateB = new Date(b.period);
        return dateB - dateA;
      })
      .slice(0, 12); // Last 12 months

    // Group by quarter
    const quarterMap = {};
    reports.forEach(report => {
      const dateStr = report.date || report.createdAt;
      const date = new Date(dateStr);
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const quarterYear = `Q${quarter} ${date.getFullYear()}`;
      const amount = extractAmount(report.amount);
      
      if (!quarterMap[quarterYear]) {
        quarterMap[quarterYear] = { total: 0, count: 0 };
      }
      quarterMap[quarterYear].total += amount;
      quarterMap[quarterYear].count += 1;
    });

    const byQuarter = Object.entries(quarterMap)
      .map(([quarter, data]) => ({
        period: quarter,
        amount: data.total,
        count: data.count,
      }))
      .sort((a, b) => {
        // Sort by year and quarter
        const [qA, yearA] = a.period.split(' ');
        const [qB, yearB] = b.period.split(' ');
        if (yearB !== yearA) return parseInt(yearB) - parseInt(yearA);
        return parseInt(qB.substring(1)) - parseInt(qA.substring(1));
      });

    // Group by year
    const yearMap = {};
    reports.forEach(report => {
      const dateStr = report.date || report.createdAt;
      const year = new Date(dateStr).getFullYear().toString();
      const amount = extractAmount(report.amount);
      
      if (!yearMap[year]) {
        yearMap[year] = { total: 0, count: 0 };
      }
      yearMap[year].total += amount;
      yearMap[year].count += 1;
    });

    const byYear = Object.entries(yearMap)
      .map(([year, data]) => ({
        period: year,
        amount: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.period - a.period);

    return {
      byLocation,
      byMonth,
      byQuarter,
      byYear,
      byWasteType,
      totalWaste: totalWaste.toFixed(2),
    };
  };

  const handleShareAnalytics = () => {
    const data = {
      type: 'analytics',
      totalWaste: wasteAnalytics.totalWaste,
      locations: wasteAnalytics.byLocation.length,
      wasteTypes: wasteAnalytics.byWasteType.length,
      userName: userInfo?.user?.name || 'Community Member',
    };
    setShareData(data);
    setShowShareModal(true);
  };

  const handleShareLeaderboard = () => {
    // Find current user's rank - matching the logic used in the table row highlighting
    const currentUserId = userInfo?._id;
    
    // Debug: Log the data structures to help troubleshoot
    console.log('Current User Info:', userInfo);
    console.log('Current User ID:', currentUserId);
    console.log('Sample Reward:', rewards[0]);
    
    const userRank = rewards.findIndex(r => r.userId === currentUserId) + 1;
    const userReward = rewards.find(r => r.userId === currentUserId);
    
    console.log('Found Rank:', userRank);
    console.log('Found Reward:', userReward);
    
    const data = {
      type: 'leaderboard',
      rank: userRank > 0 ? userRank : '-',
      points: userReward?.points || 0,
      level: userReward?.level || 1,
      userName: userInfo?.user?.name || 'Anonymous User',
    };
    setShareData(data);
    setShowShareModal(true);
  };

  const renderAnalyticsSection = () => {
    if (analyticsLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-green-600" />
        </div>
      );
    }

    // Check if there's no data
    const hasData = parseFloat(wasteAnalytics.totalWaste) > 0;

    if (!hasData) {
      return (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-lg p-8">
          <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Analytics Data Available</h3>
          <p className="text-gray-500 text-center">
            Start collecting waste reports to see analytics and insights.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Share Button */}
        <div className="flex justify-end">
          <button
            onClick={handleShareAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
          >
            <Share2 className="h-4 w-4" />
            Share Analytics
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Waste Collected</p>
                <h3 className="text-3xl font-bold mt-2">{wasteAnalytics.totalWaste} kg</h3>
              </div>
              <TrendingUp className="h-12 w-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Locations</p>
                <h3 className="text-3xl font-bold mt-2">{wasteAnalytics.byLocation.length}</h3>
              </div>
              <MapPin className="h-12 w-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Waste Types</p>
                <h3 className="text-3xl font-bold mt-2">{wasteAnalytics.byWasteType.length}</h3>
              </div>
              <PieChart className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* Location-wise Analysis */}
        {wasteAnalytics.byLocation.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Top Locations by Waste Collection</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (kg)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reports</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {wasteAnalytics.byLocation.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {item.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {item.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Waste Type Analysis */}
        {wasteAnalytics.byWasteType.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Waste Type Distribution</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wasteAnalytics.byWasteType.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{item.type}</h4>
                    <span className="text-sm font-bold text-purple-600">{item.percentage}%</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{item.amount.toFixed(2)} kg</p>
                  <p className="text-sm text-gray-600">{item.count} reports</p>
                  <div className="mt-3 w-full bg-purple-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time-based Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Analysis */}
          {wasteAnalytics.byMonth.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Monthly Collection</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {wasteAnalytics.byMonth.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.period}</p>
                      <p className="text-sm text-gray-600">{item.count} reports</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{item.amount.toFixed(2)} kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quarterly & Yearly Analysis */}
          <div className="space-y-6">
            {/* Quarterly */}
            {wasteAnalytics.byQuarter.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-gray-800">Quarterly Collection</h3>
                </div>
                <div className="space-y-3">
                  {wasteAnalytics.byQuarter.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.period}</p>
                        <p className="text-sm text-gray-600">{item.count} reports</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{item.amount.toFixed(2)} kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yearly */}
            {wasteAnalytics.byYear.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">Yearly Collection</h3>
                </div>
                <div className="space-y-3">
                  {wasteAnalytics.byYear.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-gray-800">{item.period}</p>
                        <p className="text-sm text-gray-600">{item.count} reports</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{item.amount.toFixed(2)} kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={settings.darkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-gray-50 text-gray-800 min-h-screen'}>
      <div className="box-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-green-600" />
            Performance Dashboard
          </h1>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-lg mb-6 p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "leaderboard"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5" />
                  <span>Leaderboard</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === "analytics"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Waste Analytics</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === "leaderboard" ? (
            loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6">
                  <div className="flex justify-between items-center text-white">
                    <Trophy className="h-8 sm:h-10 w-8 sm:w-10" />
                    <span className="text-lg sm:text-2xl font-bold">Top Performers</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleShareLeaderboard}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                        title="Share your rank"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                      <Award className="h-8 sm:h-10 w-8 sm:w-10" />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rewards.map((reward, index) => (
                        <tr
                          key={reward.userInfo._id}
                          className={`${
                            reward.userInfo._id && userInfo._id === reward.userId ? "bg-indigo-50" : ""
                          } hover:bg-gray-50 transition-colors duration-150 ease-in-out`}
                        >
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index < 3 ? (
                                <Crown
                                  className={`h-5 sm:h-6 w-5 sm:w-6 ${
                                    index === 0
                                      ? "text-yellow-400"
                                      : index === 1
                                      ? "text-gray-400"
                                      : "text-yellow-600"
                                  }`}
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-900">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 sm:h-10 w-8 sm:w-10">
                                <User className="h-full w-full rounded-full bg-gray-200 text-gray-500 p-2" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {reward.userInfo.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Award className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-500 mr-2" />
                              <div className="text-sm font-semibold text-gray-900">
                                {reward.points}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span className="px-2 sm:px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              Level {reward.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            renderAnalyticsSection()
          )}
        </div>
      </div>

      {/* Social Share Modal */}
      {showShareModal && shareData && (
        <SocialShare
          type={shareData.type}
          data={shareData}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default LeaderBoard;