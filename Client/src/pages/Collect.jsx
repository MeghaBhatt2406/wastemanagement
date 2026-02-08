// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Calendar,
//   CheckCircle,
//   Clock,
//   Loader,
//   MapPin,
//   Search,
//   Trash2,
//   Upload,
//   Weight,
// } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { useAppStore } from "@/store/store";
// import { apiClient } from "@/lib/api-client";
// import {
//   GET_REPORTS_TO_COLLECT,
//   UPDATE_REPORT_STATUS,
// } from "@/utils/constant";
// import { toast } from "sonner";

// // Utility function component to Style Status Badge for Reports.
// function StatusBadge({ status }) {
//   const statusConfig = {
//     Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
//     in_progress: { color: "bg-blue-100 text-blue-800", icon: Trash2 },
//     completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
//     Collected: { color: "bg-purple-100 text-purple-800", icon: CheckCircle },
//   };
//   const { color, icon: Icon } = statusConfig[status];

//   return (
//     <span
//       className={`px-2 py-1 rounded-full text-xs font-medium ${color} flex items-center`}
//     >
//       <Icon className="mr-1 h-3 w-3" />
//       {status.replace("_", " ")}
//     </span>
//   );
// }

// const Collect = () => {
//   const { userInfo } = useAppStore();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [hoveredWasteType, setHoveredWasteType] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [paginatedReports, setPaginatedReports] = useState([]);
//   const [totalReports, setTotalReports] = useState(0);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [verificationImage, setVerificationImage] = useState(null);
//   const [verificationStatus, setVerificationStatus] = useState("idle");
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageCount = Math.ceil(totalReports / 5) || 1;
//   const user = userInfo.user;

//   const fetchReports = async ({ skip, limit }) => {
//     if (reports.length === totalReports && totalReports > 0) return;
//     try {
//       setLoading(true);
//       const response = await apiClient.get(GET_REPORTS_TO_COLLECT, {
//         withCredentials: true,
//         params: { skip, limit },
//       });
//       if (response.status === 200 && response.data) {
//         setTotalReports(response.data.totalReports);
//         const resReport = response.data.reports;
//         const formattedFetchedReports = resReport.map((report) => ({
//           id: report.id,
//           location: report.location,
//           wasteType: report.wasteType,
//           amount: report.amount,
//           imageUrl: report.imageUrl,
//           date: report.date.split("T")[0],
//           status: report.status,
//           collectorId: report.collectorId,
//         }));
//         setReports((prevReports) => [
//           ...prevReports,
//           ...formattedFetchedReports,
//         ]);
//       }
//     } catch (error) {
//       console.error("Some Error Occured");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports({ skip: currentPage * 5 - 5, limit: 5 });
//   }, []);
  
//   useEffect(() => {
//     const startIndex = (currentPage - 1) * 5;
//     const endIndex =
//       startIndex + 5 > reports.length ? reports.length : startIndex + 5;
//     setPaginatedReports(reports.slice(startIndex, endIndex));
//   }, [currentPage, reports]);

//   const handleNextPageClick = () => {
//     setCurrentPage((prev) => Math.min(prev + 1, pageCount));
//     fetchReports({ skip: currentPage * 5, limit: 5 });
//   };

//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       const response = await apiClient.patch(
//         UPDATE_REPORT_STATUS,
//         { reportId: taskId, status: newStatus },
//         { withCredentials: true }
//       );
//       if (response.status === 200 && response.data) {
//         const updatedReport = response.data;
//         updatedReport.date = updatedReport.date.split("T")[0];
//         setReports((prev) =>
//           prev.map((task) =>
//             task.id === taskId ? { ...task, ...updatedReport } : task
//           )
//         );
//         toast.success("Updated task status successfully!");
//       }
//     } catch (error) {
//       console.error("Error updating task status:", error);
//       toast.error("Failed to update task status. Please try again.");
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size too large. Please select an image under 5MB.");
//         return;
//       }
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setVerificationImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleVerify = async () => {
//     if (!selectedTask || !verificationImage || !user) {
//       toast.error("Please upload a verification image.");
//       return;
//     }

//     setVerificationStatus("verifying");

//     try {
//       // Simple manual verification - just store the image and mark as collected
//       const verificationResult = {
//         manualVerification: true,
//         verifiedBy: user.name,
//         verifiedAt: new Date().toISOString(),
//         notes: "Manually verified by collector"
//       };

//       // Update report status to Collected
//       const response = await apiClient.patch(
//         UPDATE_REPORT_STATUS,
//         { 
//           reportId: selectedTask.id, 
//           status: "Collected",
//           verificationImage: verificationImage,
//           verificationResult: verificationResult
//         },
//         { withCredentials: true }
//       );

//       if (response.status === 200 && response.data) {
//         const newUpdatedReport = response.data;
//         newUpdatedReport.date = newUpdatedReport.date.split("T")[0];
//         setReports((prev) =>
//           prev.map((task) =>
//             task.id === selectedTask.id
//               ? { ...task, ...newUpdatedReport }
//               : task
//           )
//         );

//         setVerificationStatus("success");
//         toast.success("Collection verified successfully! Reward points earned.");
        
//         setTimeout(() => {
//           setSelectedTask(null);
//           setVerificationImage(null);
//           setVerificationStatus("idle");
//         }, 2000);
//       }
//     } catch (error) {
//       toast.error("Verification failed. Please try again.");
//       console.error("Error verifying waste:", error);
//       setVerificationStatus("failure");
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-semibold mb-6 text-gray-800">
//         Waste Collection Tasks
//       </h1>

//       <div className="mb-4 flex items-center">
//         <Input
//           type="text"
//           placeholder="Search by area..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="mr-2"
//         />
//         <Button variant="outline" size="icon">
//           <Search className="h-4 w-4" />
//         </Button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <Loader className="animate-spin h-8 w-8 text-gray-500" />
//         </div>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {paginatedReports.map((task) => (
//               <div
//                 key={task.id}
//                 className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <h2 className="text-lg font-medium text-gray-800 flex items-center">
//                     <MapPin className="w-5 h-5 mr-2 text-gray-500" />
//                     {task.location}
//                   </h2>
//                   <StatusBadge status={task.status} />
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
//                   <div className="flex items-center relative">
//                     <Trash2 className="w-4 h-4 mr-2 text-gray-500" />
//                     <span
//                       onMouseEnter={() => setHoveredWasteType(task.wasteType)}
//                       onMouseLeave={() => setHoveredWasteType(null)}
//                       className="cursor-pointer"
//                     >
//                       {task.wasteType.length > 8
//                         ? `${task.wasteType.slice(0, 8)}...`
//                         : task.wasteType}
//                     </span>
//                     {hoveredWasteType === task.wasteType && (
//                       <div className="absolute left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
//                         {task.wasteType}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex items-center">
//                     <Weight className="w-4 h-4 mr-2 text-gray-500" />
//                     {task.amount}
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar className="w-4 h-4 mr-2 text-gray-500" />
//                     {task.date}
//                   </div>
//                 </div>
//                 {task.imageUrl && (
//                   <div className="mb-3">
//                     <p className="text-xs text-gray-500 mb-1">Reported Image:</p>
//                     <img 
//                       src={task.imageUrl} 
//                       alt="Reported waste" 
//                       className="w-20 h-20 object-cover rounded border"
//                     />
//                   </div>
//                 )}
//                 <div className="flex justify-end">
//                   {task.status === "Pending" && (
//                     <Button
//                       onClick={() => handleStatusChange(task.id, "in_progress")}
//                       variant="outline"
//                       size="sm"
//                     >
//                       Start Collection
//                     </Button>
//                   )}
//                   {task.status === "in_progress" &&
//                     task.collectorId === user?.id && (
//                       <>
//                         <Button
//                           onClick={() => handleStatusChange(task.id, "Pending")}
//                           variant="outline"
//                           size="sm"
//                         >
//                           Cancel Collection
//                         </Button>
//                         <Button
//                           className="ml-4"
//                           onClick={() => setSelectedTask(task)}
//                           variant="outline"
//                           size="sm"
//                         >
//                           Complete & Verify
//                         </Button>
//                       </>
//                     )}
//                   {task.status === "in_progress" &&
//                     task.collectorId !== user?.id && (
//                       <span className="text-yellow-600 text-sm font-medium">
//                         In progress by another collector
//                       </span>
//                     )}
//                   {task.status === "Collected" && (
//                     <span className="text-green-600 text-sm font-medium">
//                       ✓ Collection Completed
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4 flex justify-center">
//             <Button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="mr-2"
//             >
//               Previous
//             </Button>
//             <span className="mx-2 self-center">
//               Page {currentPage} of {pageCount}
//             </span>
//             <Button
//               onClick={handleNextPageClick}
//               disabled={currentPage === pageCount}
//               className="ml-2"
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}

//       {selectedTask && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <h3 className="text-xl font-semibold mb-4">Verify Collection</h3>
//             <p className="mb-4 text-sm text-gray-600">
//               Upload a photo of the collected waste as proof of collection.
//             </p>
            
//             {/* Show task details */}
//             <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//               <h4 className="font-medium mb-2">Task Details:</h4>
//               <p><strong>Location:</strong> {selectedTask.location}</p>
//               <p><strong>Waste Type:</strong> {selectedTask.wasteType}</p>
//               <p><strong>Amount:</strong> {selectedTask.amount}</p>
//             </div>
            
//             {/* Show original reported image if available */}
//             {selectedTask.imageUrl && (
//               <div className="mb-4">
//                 <p className="text-sm font-medium mb-2">Originally Reported Image:</p>
//                 <img 
//                   src={selectedTask.imageUrl} 
//                   alt="Originally reported waste" 
//                   className="max-w-[300px] h-auto rounded-md border"
//                 />
//               </div>
//             )}
            
//             <div className="mb-4">
//               <label
//                 htmlFor="verification-image"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Upload Collection Proof Photo
//               </label>
//               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                 <div className="space-y-1 text-center">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="flex text-sm text-gray-600">
//                     <label
//                       htmlFor="verification-image"
//                       className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
//                     >
//                       <span>Upload a file</span>
//                       <input
//                         id="verification-image"
//                         name="verification-image"
//                         type="file"
//                         className="sr-only"
//                         onChange={handleImageUpload}
//                         accept="image/*"
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     PNG, JPG, GIF up to 5MB
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {verificationImage && (
//               <div className="mb-4">
//                 <p className="text-sm font-medium mb-2">Your Collection Proof:</p>
//                 <img
//                   src={verificationImage}
//                   alt="Collection verification"
//                   className="max-w-[300px] h-auto rounded-md border"
//                 />
//               </div>
//             )}
            
//             <Button
//               onClick={handleVerify}
//               className="w-full bg-green-600 hover:bg-green-700"
//               disabled={!verificationImage || verificationStatus === "verifying" || verificationStatus === "success"}
//             >
//               {verificationStatus === "verifying" ? (
//                 <>
//                   <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
//                   Verifying...
//                 </>
//               ) : verificationStatus === "success" ? (
//                 "✓ Verified Successfully!"
//               ) : (
//                 "✓ Confirm Collection"
//               )}
//             </Button>
            
//             {verificationStatus === "success" && (
//               <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
//                 <div className="flex items-center">
//                   <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
//                   <div>
//                     <h4 className="text-lg font-semibold text-green-800">
//                       Collection Verified!
//                     </h4>
//                     <p className="text-sm text-green-700 mt-1">
//                       Reward points have been added to your account.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {verificationStatus === "failure" && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
//                 <div className="flex items-center">
//                   <span className="text-red-600 mr-2">✗</span>
//                   <p className="text-red-700">
//                     Verification failed. Please try again.
//                   </p>
//                 </div>
//               </div>
//             )}
            
//             <Button
//               onClick={() => {
//                 setSelectedTask(null);
//                 setVerificationImage(null);
//                 setVerificationStatus("idle");
//               }}
//               variant="outline"
//               className="w-full mt-2"
//               disabled={verificationStatus === "verifying"}
//             >
//               Close
//             </Button>
//           </div>
//         </div>
//       )}

//       {userInfo ? (
//         <p className="text-sm text-gray-600 mb-4">
//           Logged in as: {userInfo.user?.name}
//         </p>
//       ) : (
//         <p className="text-sm text-red-600 mb-4">
//           Please log in to collect waste and earn rewards.
//         </p>
//       )}
//     </div>
//   );
// };

// export default Collect;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle,
  Clock,
  Loader,
  MapPin,
  Search,
  Trash2,
  Upload,
  Weight,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/api-client";
import {
  GET_REPORTS_TO_COLLECT,
  UPDATE_REPORT_STATUS,
} from "@/utils/constant";
import { toast } from "sonner";

// Utility function component to Style Status Badge for Reports.
function StatusBadge({ status }) {
  const statusConfig = {
    Pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    in_progress: { color: "bg-blue-100 text-blue-800", icon: Trash2 },
    completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    Collected: { color: "bg-purple-100 text-purple-800", icon: CheckCircle },
  };
  const { color, icon: Icon } = statusConfig[status];

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${color} flex items-center`}
    >
      <Icon className="mr-1 h-3 w-3" />
      {status.replace("_", " ")}
    </span>
  );
}

const Collect = () => {
  const { userInfo } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredWasteType, setHoveredWasteType] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [paginatedReports, setPaginatedReports] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [verificationImage, setVerificationImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("idle");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const user = userInfo.user;

  const fetchReports = async ({ skip, limit }) => {
    if (reports.length === totalReports && totalReports > 0) return;
    try {
      setLoading(true);
      const response = await apiClient.get(GET_REPORTS_TO_COLLECT, {
        withCredentials: true,
        params: { skip, limit },
      });
      if (response.status === 200 && response.data) {
        setTotalReports(response.data.totalReports);
        const resReport = response.data.reports;
        const formattedFetchedReports = resReport.map((report) => ({
          id: report.id,
          location: report.location,
          wasteType: report.wasteType,
          amount: report.amount,
          imageUrl: report.imageUrl,
          date: report.date.split("T")[0],
          status: report.status,
          collectorId: report.collectorId,
        }));
        setReports((prevReports) => [
          ...prevReports,
          ...formattedFetchedReports,
        ]);
      }
    } catch (error) {
      console.error("Some Error Occured");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports({ skip: 0, limit: 100 }); // Fetch more reports initially for better search
  }, []);

  // Filter reports based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReports(reports);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = reports.filter((report) => {
        return (
          report.location.toLowerCase().includes(searchLower) ||
          report.wasteType.toLowerCase().includes(searchLower) ||
          report.amount.toLowerCase().includes(searchLower) ||
          report.status.toLowerCase().includes(searchLower)
        );
      });
      setFilteredReports(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, reports]);

  // Paginate filtered reports
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedReports(filteredReports.slice(startIndex, endIndex));
  }, [currentPage, filteredReports]);

  const pageCount = Math.ceil(filteredReports.length / pageSize) || 1;

  const handleNextPageClick = () => {
    if (currentPage < pageCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await apiClient.patch(
        UPDATE_REPORT_STATUS,
        { reportId: taskId, status: newStatus },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data) {
        const updatedReport = response.data;
        updatedReport.date = updatedReport.date.split("T")[0];
        setReports((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, ...updatedReport } : task
          )
        );
        toast.success("Updated task status successfully!");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size too large. Please select an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (!selectedTask || !verificationImage || !user) {
      toast.error("Please upload a verification image.");
      return;
    }

    setVerificationStatus("verifying");

    try {
      // Simple manual verification - just store the image and mark as collected
      const verificationResult = {
        manualVerification: true,
        verifiedBy: user.name,
        verifiedAt: new Date().toISOString(),
        notes: "Manually verified by collector"
      };

      // Update report status to Collected
      const response = await apiClient.patch(
        UPDATE_REPORT_STATUS,
        { 
          reportId: selectedTask.id, 
          status: "Collected",
          verificationImage: verificationImage,
          verificationResult: verificationResult
        },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data) {
        const newUpdatedReport = response.data;
        newUpdatedReport.date = newUpdatedReport.date.split("T")[0];
        setReports((prev) =>
          prev.map((task) =>
            task.id === selectedTask.id
              ? { ...task, ...newUpdatedReport }
              : task
          )
        );

        setVerificationStatus("success");
        toast.success("Collection verified successfully! Reward points earned.");
        
        setTimeout(() => {
          setSelectedTask(null);
          setVerificationImage(null);
          setVerificationStatus("idle");
        }, 2000);
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error("Error verifying waste:", error);
      setVerificationStatus("failure");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Waste Collection Tasks
      </h1>

      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search by location, waste type, amount, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredReports.length} result{filteredReports.length !== 1 ? 's' : ''} for "{searchTerm}"
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <>
          {paginatedReports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Trash2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No results found" : "No tasks available"}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Check back later for new collection tasks"}
              </p>
              {searchTerm && (
                <Button
                  onClick={handleClearSearch}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedReports.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-medium text-gray-800 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                        {task.location}
                      </h2>
                      <StatusBadge status={task.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center relative">
                        <Trash2 className="w-4 h-4 mr-2 text-gray-500" />
                        <span
                          onMouseEnter={() => setHoveredWasteType(task.wasteType)}
                          onMouseLeave={() => setHoveredWasteType(null)}
                          className="cursor-pointer"
                        >
                          {task.wasteType.length > 8
                            ? `${task.wasteType.slice(0, 8)}...`
                            : task.wasteType}
                        </span>
                        {hoveredWasteType === task.wasteType && (
                          <div className="absolute left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                            {task.wasteType}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Weight className="w-4 h-4 mr-2 text-gray-500" />
                        {task.amount}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        {task.date}
                      </div>
                    </div>
                    {task.imageUrl && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Reported Image:</p>
                        <img 
                          src={task.imageUrl} 
                          alt="Reported waste" 
                          className="w-20 h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      {task.status === "Pending" && (
                        <Button
                          onClick={() => handleStatusChange(task.id, "in_progress")}
                          variant="outline"
                          size="sm"
                        >
                          Start Collection
                        </Button>
                      )}
                      {task.status === "in_progress" &&
                        task.collectorId === user?.id && (
                          <>
                            <Button
                              onClick={() => handleStatusChange(task.id, "Pending")}
                              variant="outline"
                              size="sm"
                            >
                              Cancel Collection
                            </Button>
                            <Button
                              onClick={() => setSelectedTask(task)}
                              variant="outline"
                              size="sm"
                              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            >
                              Complete & Verify
                            </Button>
                          </>
                        )}
                      {task.status === "in_progress" &&
                        task.collectorId !== user?.id && (
                          <span className="text-yellow-600 text-sm font-medium">
                            In progress by another collector
                          </span>
                        )}
                      {task.status === "Collected" && (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Collection Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-center items-center gap-4">
                <Button
                  onClick={handlePreviousPageClick}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {pageCount}
                </span>
                <Button
                  onClick={handleNextPageClick}
                  disabled={currentPage === pageCount}
                  variant="outline"
                >
                  Next
                </Button>
              </div>

              {/* Total count */}
              <div className="mt-2 text-center text-xs text-gray-500">
                Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredReports.length)} of {filteredReports.length} tasks
              </div>
            </>
          )}
        </>
      )}

      {/* Verification Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Verify Collection</h3>
            <p className="mb-4 text-sm text-gray-600">
              Upload a photo of the collected waste as proof of collection.
            </p>
            
            {/* Show task details */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Task Details:</h4>
              <p><strong>Location:</strong> {selectedTask.location}</p>
              <p><strong>Waste Type:</strong> {selectedTask.wasteType}</p>
              <p><strong>Amount:</strong> {selectedTask.amount}</p>
            </div>
            
            {/* Show original reported image if available */}
            {selectedTask.imageUrl && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Originally Reported Image:</p>
                <img 
                  src={selectedTask.imageUrl} 
                  alt="Originally reported waste" 
                  className="max-w-[300px] h-auto rounded-md border"
                />
              </div>
            )}
            
            <div className="mb-4">
              <label
                htmlFor="verification-image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Collection Proof Photo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="verification-image"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="verification-image"
                        name="verification-image"
                        type="file"
                        className="sr-only"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
            
            {verificationImage && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Your Collection Proof:</p>
                <img
                  src={verificationImage}
                  alt="Collection verification"
                  className="max-w-[300px] h-auto rounded-md border"
                />
              </div>
            )}
            
            <Button
              onClick={handleVerify}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!verificationImage || verificationStatus === "verifying" || verificationStatus === "success"}
            >
              {verificationStatus === "verifying" ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Verifying...
                </>
              ) : verificationStatus === "success" ? (
                "✓ Verified Successfully!"
              ) : (
                "✓ Confirm Collection"
              )}
            </Button>
            
            {verificationStatus === "success" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h4 className="text-lg font-semibold text-green-800">
                      Collection Verified!
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      Reward points have been added to your account.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {verificationStatus === "failure" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">✗</span>
                  <p className="text-red-700">
                    Verification failed. Please try again.
                  </p>
                </div>
              </div>
            )}
            
            <Button
              onClick={() => {
                setSelectedTask(null);
                setVerificationImage(null);
                setVerificationStatus("idle");
              }}
              variant="outline"
              className="w-full mt-2"
              disabled={verificationStatus === "verifying"}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {userInfo ? (
        <p className="text-sm text-gray-600 mt-6">
          Logged in as: {userInfo.user?.name}
        </p>
      ) : (
        <p className="text-sm text-red-600 mt-6">
          Please log in to collect waste and earn rewards.
        </p>
      )}
    </div>
  );
};

export default Collect;