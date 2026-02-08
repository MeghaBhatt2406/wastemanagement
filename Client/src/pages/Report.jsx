// // components/Report.jsx
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { CheckCircle, Loader, MapPin, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   CREATE_REPORT_ROUTE,
//   Gemini_Api_key,
//   GET_REPORT_ROUTE,
// } from "@/utils/constant";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { apiClient } from "@/lib/api-client";

// const Report = () => {
//   const [preview, setPreview] = useState("");
//   const [file, setFile] = useState("");
//   const [newReport, setNewReport] = useState({
//     location: "",
//     type: "",
//     amount: "",
//   });
//   const [verificationStatus, setVerificationStatus] = useState();
//   const [verificationResult, setVerificationResult] = useState();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get(GET_REPORT_ROUTE, {
//         withCredentials: true,
//       });
//       if (response.data) {
//         const formattedFetchedReports = response.data.map((report) => ({
//           id: report._id,
//           location: report.location,
//           wasteType: report.wasteType,
//           amount: report.amount,
//           imageUrl: report.imageUrl, // Include imageUrl
//           createdAt: report.createdAt.split("T")[0],
//         }));
//         setReports(formattedFetchedReports);
//       }
//     } catch (error) {
//       console.error("Failed to fetch reports:", error);
//       toast.error("Failed to fetch reports. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (verificationStatus !== "success") {
//       toast.error("Please verify the waste before submitting the report.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const createdReport = {
//         ...newReport,
//         imageUrl: preview, // UNCOMMENTED - Now sending image
//         verificationResult,
//       };

//       const response = await apiClient.post(
//         CREATE_REPORT_ROUTE,
//         { report: createdReport },
//         { withCredentials: true }
//       );
      
//       if (response.status === 201) {
//         const report = response.data;
//         toast.success("Report submitted successfully");
//         const formattedReport = {
//           id: report._id,
//           location: report.location,
//           wasteType: report.wasteType,
//           amount: report.amount,
//           imageUrl: report.imageUrl, // Include imageUrl
//           createdAt: report.createdAt.split("T")[0],
//         };

//         setReports([formattedReport, ...reports]);

//         setNewReport({
//           location: "",
//           type: "",
//           amount: "",
//         });
//         setPreview("");
//         setFile("");
//         setVerificationStatus("");
//         setVerificationResult("");
//         setIsSubmitting(false);
//       }
//     } catch (error) {
//       setIsSubmitting(false);
//       console.error("Failed to submit report:", error);
//       if (error.response?.status === 413) {
//         toast.error("Image too large. Please try with a smaller image.");
//       } else {
//         toast.error("Failed to submit report. Please try again later.");
//       }
//     }
//   }

//   function handleFileChange(e) {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0];
      
//       // Check file size (max 5MB)
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         toast.error("Image size too large. Please select an image under 5MB.");
//         return;
//       }
      
//       setFile(selectedFile);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setPreview(e.target?.result);
//       };
//       reader.readAsDataURL(selectedFile);
//     }
//   }

//   const readFileAsBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleVerify = async () => {
//     if (!file) return;

//     setVerificationStatus("verifying");

//     try {
//       const genAI = new GoogleGenerativeAI(Gemini_Api_key);
//       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//       const base64Data = await readFileAsBase64(file);

//       const imageParts = [
//         {
//           inlineData: {
//             data: base64Data.split(",")[1],
//             mimeType: file.type,
//           },
//         },
//       ];

//       const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
//         1. The type of waste (e.g., plastic, paper, glass, metal, organic).
//         2. An estimate of the quantity or amount (Strictly in kg or liters).
//         3. Your confidence level in this assessment (as a percentage).
        
//         Strictly Respond in JSON format like this:
//         {
//           "wasteType": "type of waste",
//           "quantity": "estimated quantity with unit",
//           "confidence": confidence level as a number between 0 and 1
//         }
//         if the image cannot be considered as any type of waste or cannot be converted into any waste in future then provide the response like this:
//         {
//           "message": "Not a waste"
//         }`;

//       const result = await model.generateContent([prompt, ...imageParts]);

//       const response = result.response;
//       const text = await response.text().match(/\{[^]*\}/);
//       const parsedResult = JSON.parse(text);

//       if (parsedResult.message === "Not a waste") {
//         toast.error("The uploaded image does not contain waste.");
//         setVerificationStatus("failure");
//         return;
//       }
//       if (
//         parsedResult.wasteType &&
//         parsedResult.quantity &&
//         parsedResult.confidence
//       ) {
//         toast.success(`Waste categorized as ${parsedResult.wasteType}`);
//         setVerificationResult(parsedResult);
//         setVerificationStatus("success");
//         setNewReport({
//           ...newReport,
//           type: parsedResult.wasteType,
//           amount: parsedResult.quantity,
//         });
//       } else {
//         toast.error("Invalid verification result.");
//         console.error("Invalid verification result:", parsedResult);
//         setVerificationStatus("failure");
//       }
//     } catch (error) {
//       console.error("Error verifying waste:", error);
//       setVerificationStatus("failure");
//     }
//   };

//   function handleInputChange(e) {
//     const { name, value } = e.target;
//     setNewReport({ ...newReport, [name]: value });
//   }

//   return (
//     <>
//       <div className="p-2 sm:p-8 max-w-4xl mx-auto overflow-x-hidden">
//         <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
//           Report waste
//         </h1>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg mb-12"
//         >
//           {/* Upload Section */}
//           <div className="mb-6 sm:mb-8">
//             <label
//               htmlFor="waste-image"
//               className="block text-base sm:text-lg font-medium text-gray-700 mb-2"
//             >
//               Upload Waste Image
//             </label>
//             <div className="mt-1 flex flex-col sm:flex-row justify-center items-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
//               <div className="space-y-1 text-center">
//                 <Upload className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
//                 <div className="flex text-sm text-gray-600 justify-center">
//                   <label
//                     htmlFor="waste-image"
//                     className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
//                   >
//                     <span>Upload a file</span>
//                     <input
//                       id="waste-image"
//                       name="waste-image"
//                       type="file"
//                       className="sr-only"
//                       onChange={handleFileChange}
//                       accept="image/*"
//                     />
//                   </label>
//                   <p className="pl-1">or drag and drop</p>
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   PNG, JPG, GIF up to 5MB
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Preview */}
//           {preview && (
//             <div className="mt-4 mb-6 sm:mb-8 flex justify-center">
//               <img
//                 src={preview}
//                 alt="Waste preview"
//                 className="md:max-w-full max-w-56 sm:max-w-[300px] h-auto rounded-xl shadow-md"
//               />
//             </div>
//           )}

//           <Button
//             type="button"
//             onClick={handleVerify}
//             className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
//             disabled={!file || verificationStatus === "verifying"}
//           >
//             {verificationStatus === "verifying" ? (
//               <>
//                 <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
//                 Verifying...
//               </>
//             ) : (
//               "Verify Waste"
//             )}
//           </Button>

//           {/* Verification Result */}
//           {verificationStatus === "success" && verificationResult && (
//             <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
//               <div className="flex items-center">
//                 <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
//                 <div>
//                   <h3 className="text-lg font-medium text-green-800">
//                     Verification Successful
//                   </h3>
//                   <div className="mt-2 text-sm text-green-700">
//                     <p>Waste Type: {verificationResult.wasteType}</p>
//                     <p>
//                       Quantity:{" "}
//                       {verificationResult.quantity.startsWith("approximately")
//                         ? verificationResult.quantity.replace(
//                             "approximately",
//                             "Approx."
//                           )
//                         : verificationResult.quantity}
//                     </p>
//                     <p>
//                       Confidence:{" "}
//                       {(verificationResult.confidence * 100).toFixed(2)}%
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Input Fields */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
//             <div>
//               <label
//                 htmlFor="location"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Location
//               </label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 value={newReport.location}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
//                 placeholder="Enter waste location"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="type"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Waste Type
//               </label>
//               <input
//                 type="text"
//                 id="type"
//                 name="type"
//                 value={newReport.type}
//                 onChange={handleInputChange}
//                 required
//                 readOnly
//                 className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none"
//                 placeholder="Verified waste type"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="amount"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Estimated Amount
//               </label>
//               <input
//                 type="text"
//                 id="amount"
//                 name="amount"
//                 value={
//                   newReport.amount.startsWith("approximately")
//                     ? newReport.amount.replace("approximately", "Approx.")
//                     : newReport.amount
//                 }
//                 onChange={handleInputChange}
//                 required
//                 readOnly
//                 className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none"
//                 placeholder="Verified amount"
//               />
//             </div>
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
//                 Submitting...
//               </>
//             ) : (
//               "Submit Report"
//             )}
//           </Button>
//         </form>

//         {/* Reports Table */}
//         <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
//           Recent Reports
//         </h2>
//         {loading ? (
//           <div className="w-full flex justify-center">
//             <Loader className="animate-spin ml-1 mr-3 h-10 w-10 text-green-500" />
//           </div>
//         ) : reports.length > 0 && reports[0].id ? (
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-2">
//             <div className="max-h-96 overflow-y-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 sticky top-0">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Image
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {reports.map(
//                     (report) =>
//                       report.id && (
//                         <tr
//                           key={report.id}
//                           className="hover:bg-gray-50 transition-colors duration-200"
//                         >
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {report.imageUrl ? (
//                               <img
//                                 src={report.imageUrl}
//                                 alt="Waste"
//                                 className="w-12 h-12 object-cover rounded"
//                               />
//                             ) : (
//                               <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
//                                 <span className="text-xs text-gray-500">No Image</span>
//                               </div>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={report.location}>
//                             <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
//                             {report.location.length > 15
//                               ? report.location.slice(0, 15) + "..."
//                               : report.location}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={report.wasteType}>
//                             {report.wasteType.length > 15
//                               ? report.wasteType.slice(0, 15) + "..."
//                               : report.wasteType}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={report.amount}>
//                             {report.amount.length > 15
//                               ? report.amount.slice(0, 15) + "..."
//                               : report.amount}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {report.createdAt}
//                           </td>
//                         </tr>
//                       )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center">
//             You have not reported any Waste Yet
//           </p>
//         )}
//       </div>
//     </>
//   );
// };

// export default Report;

// components/Report.jsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle, Loader, MapPin, Upload, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CREATE_REPORT_ROUTE,
  Gemini_Api_key,
  GET_REPORT_ROUTE,
} from "@/utils/constant";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiClient } from "@/lib/api-client";

const Report = () => {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState("");
  const [newReport, setNewReport] = useState({
    location: "",
    type: "",
    amount: "",
    coordinates: null, // Store coordinates separately
  });
  const [verificationStatus, setVerificationStatus] = useState();
  const [verificationResult, setVerificationResult] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(GET_REPORT_ROUTE, {
        withCredentials: true,
      });
      if (response.data) {
        const formattedFetchedReports = response.data.map((report) => ({
          id: report._id,
          location: report.location,
          wasteType: report.wasteType,
          amount: report.amount,
          imageUrl: report.imageUrl,
          coordinates: report.coordinates,
          createdAt: report.createdAt.split("T")[0],
        }));
        setReports(formattedFetchedReports);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast.error("Failed to fetch reports. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Function to get current location with detailed address
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = {
          latitude: latitude,
          longitude: longitude,
        };

        try {
          // Reverse geocoding using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          console.log("data :",data);

          if (data && data.address) {
            const address = data.address;
            let detailedLocation = "";

            // Build detailed address with all available components
            const addressParts = [];

            // Building/House number and road
            if (address.house_number && address.road) {
              addressParts.push(`${address.house_number} ${address.road}`);
            } else if (address.road) {
              addressParts.push(address.road);
            } else if (address.hamlet) {
              addressParts.push(address.hamlet);
            }

            // Neighborhood/Society/Area
            if (address.neighbourhood) {
              addressParts.push(address.neighbourhood);
            } else if (address.suburb) {
              addressParts.push(address.suburb);
            } else if (address.residential) {
              addressParts.push(address.residential);
            }

            // District/Locality
            if (address.city_district) {
              addressParts.push(address.city_district);
            } else if (address.town) {
              addressParts.push(address.town);
            }

            // City
            if (address.city) {
              addressParts.push(address.city);
            } else if (address.municipality) {
              addressParts.push(address.municipality);
            }

            // State
            if (address.state) {
              addressParts.push(address.state);
            }

            // Country
            if (address.country) {
              addressParts.push(address.country);
            }

            // Postal code
            if (address.postcode) {
              addressParts.push(address.postcode);
            }

            detailedLocation = addressParts.join(", ");

            // If no detailed address parts, use display_name
            if (!detailedLocation) {
              detailedLocation = data.display_name;
            }

            // Add coordinates to the location string
            const locationWithCoords = `${detailedLocation} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`;

            setNewReport({
              ...newReport,
              location: locationWithCoords,
              coordinates: coords,
            });

            toast.success("Detailed location detected successfully");
          } else {
            // Fallback to coordinates only
            const coordsString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setNewReport({
              ...newReport,
              location: coordsString,
              coordinates: coords,
            });
            toast.success("Location coordinates detected");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          // Fallback to coordinates
          const coordsString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setNewReport({
            ...newReport,
            location: coordsString,
            coordinates: coords,
          });
          toast.success("Location coordinates detected");
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        setFetchingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("An error occurred while fetching location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (verificationStatus !== "success") {
      toast.error("Please verify the waste before submitting the report.");
      return;
    }

    setIsSubmitting(true);
    try {
      const createdReport = {
        ...newReport,
        imageUrl: preview,
        verificationResult,
      };

      const response = await apiClient.post(
        CREATE_REPORT_ROUTE,
        { report: createdReport },
        { withCredentials: true }
      );
      
      if (response.status === 201) {
        const report = response.data;
        toast.success("Report submitted successfully");
        const formattedReport = {
          id: report._id,
          location: report.location,
          wasteType: report.wasteType,
          amount: report.amount,
          imageUrl: report.imageUrl,
          coordinates: report.coordinates,
          createdAt: report.createdAt.split("T")[0],
        };

        setReports([formattedReport, ...reports]);

        setNewReport({
          location: "",
          type: "",
          amount: "",
          coordinates: null,
        });
        setPreview("");
        setFile("");
        setVerificationStatus("");
        setVerificationResult("");
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Failed to submit report:", error);
      if (error.response?.status === 413) {
        toast.error("Image too large. Please try with a smaller image.");
      } else {
        toast.error("Failed to submit report. Please try again later.");
      }
    }
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size too large. Please select an image under 5MB.");
        return;
      }
      
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleVerify = async () => {
    if (!file) return;

    setVerificationStatus("verifying");

    try {
      const genAI = new GoogleGenerativeAI(Gemini_Api_key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const base64Data = await readFileAsBase64(file);

      const imageParts = [
        {
          inlineData: {
            data: base64Data.split(",")[1],
            mimeType: file.type,
          },
        },
      ];

      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
        1. The type of waste (e.g., plastic, paper, glass, metal, organic).
        2. An estimate of the quantity or amount (Strictly in kg or liters).
        3. Your confidence level in this assessment (as a percentage).
        
        Strictly Respond in JSON format like this:
        {
          "wasteType": "type of waste",
          "quantity": "estimated quantity with unit",
          "confidence": confidence level as a number between 0 and 1
        }
        if the image cannot be considered as any type of waste or cannot be converted into any waste in future then provide the response like this:
        {
          "message": "Not a waste"
        }`;

      const result = await model.generateContent([prompt, ...imageParts]);

      const response = result.response;
      const text = await response.text().match(/\{[^]*\}/);
      const parsedResult = JSON.parse(text);

      if (parsedResult.message === "Not a waste") {
        toast.error("The uploaded image does not contain waste.");
        setVerificationStatus("failure");
        return;
      }
      if (
        parsedResult.wasteType &&
        parsedResult.quantity &&
        parsedResult.confidence
      ) {
        toast.success(`Waste categorized as ${parsedResult.wasteType}`);
        setVerificationResult(parsedResult);
        setVerificationStatus("success");
        setNewReport({
          ...newReport,
          type: parsedResult.wasteType,
          amount: parsedResult.quantity,
        });
      } else {
        toast.error("Invalid verification result.");
        console.error("Invalid verification result:", parsedResult);
        setVerificationStatus("failure");
      }
    } catch (error) {
      console.error("Error verifying waste:", error);
      setVerificationStatus("failure");
    }
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewReport({ ...newReport, [name]: value });
  }

  return (
    <>
      <div className="p-2 sm:p-8 max-w-4xl mx-auto overflow-x-hidden">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          Report waste
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg mb-12"
        >
          {/* Upload Section */}
          <div className="mb-6 sm:mb-8">
            <label
              htmlFor="waste-image"
              className="block text-base sm:text-lg font-medium text-gray-700 mb-2"
            >
              Upload Waste Image
            </label>
            <div className="mt-1 flex flex-col sm:flex-row justify-center items-center px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="waste-image"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="waste-image"
                      name="waste-image"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4 mb-6 sm:mb-8 flex justify-center">
              <img
                src={preview}
                alt="Waste preview"
                className="md:max-w-full max-w-56 sm:max-w-[300px] h-auto rounded-xl shadow-md"
              />
            </div>
          )}

          <Button
            type="button"
            onClick={handleVerify}
            className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
            disabled={!file || verificationStatus === "verifying"}
          >
            {verificationStatus === "verifying" ? (
              <>
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Verifying...
              </>
            ) : (
              "Verify Waste"
            )}
          </Button>

          {/* Verification Result */}
          {verificationStatus === "success" && verificationResult && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-green-800">
                    Verification Successful
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Waste Type: {verificationResult.wasteType}</p>
                    <p>
                      Quantity:{" "}
                      {verificationResult.quantity.startsWith("approximately")
                        ? verificationResult.quantity.replace(
                            "approximately",
                            "Approx."
                          )
                        : verificationResult.quantity}
                    </p>
                    <p>
                      Confidence:{" "}
                      {(verificationResult.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location (Detailed Address with Coordinates)
              </label>
              <div className="flex gap-2">
                <textarea
                  id="location"
                  name="location"
                  value={newReport.location}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none"
                  placeholder="Enter detailed address or use GPS to auto-fill (e.g., ABC Society, Isanpur, Ahmedabad, Gujarat)"
                />
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={fetchingLocation}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors duration-300 flex items-center gap-2 h-fit"
                >
                  {fetchingLocation ? (
                    <Loader className="animate-spin h-5 w-5" />
                  ) : (
                    <Navigation className="h-5 w-5" />
                  )}
                  <span className="hidden sm:inline">
                    {fetchingLocation ? "Getting..." : "Use GPS"}
                  </span>
                </Button>
              </div>
              {newReport.coordinates && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium">
                    📍 GPS Coordinates:
                  </p>
                  <p className="text-xs text-blue-700">
                    Latitude: {newReport.coordinates.latitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-blue-700">
                    Longitude: {newReport.coordinates.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Waste Type
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={newReport.type}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none"
                  placeholder="Verified waste type"
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estimated Amount
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={
                    newReport.amount.startsWith("approximately")
                      ? newReport.amount.replace("approximately", "Approx.")
                      : newReport.amount
                  }
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 focus:outline-none"
                  placeholder="Verified amount"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>

        {/* Reports Table */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
          Recent Reports
        </h2>
        {loading ? (
          <div className="w-full flex justify-center">
            <Loader className="animate-spin ml-1 mr-3 h-10 w-10 text-green-500" />
          </div>
        ) : reports.length > 0 && reports[0].id ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-2">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map(
                    (report) =>
                      report.id && (
                        <tr
                          key={report.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {report.imageUrl ? (
                              <img
                                src={report.imageUrl}
                                alt="Waste"
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500" title={report.location}>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                              <div className="flex flex-col">
                                <span className="max-w-xs truncate">
                                  {report.location.length > 30
                                    ? report.location.slice(0, 30) + "..."
                                    : report.location}
                                </span>
                                {report.coordinates && (
                                  <span className="text-xs text-gray-400">
                                    {report.coordinates.latitude.toFixed(4)}, {report.coordinates.longitude.toFixed(4)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={report.wasteType}>
                            {report.wasteType.length > 15
                              ? report.wasteType.slice(0, 15) + "..."
                              : report.wasteType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={report.amount}>
                            {report.amount.length > 15
                              ? report.amount.slice(0, 15) + "..."
                              : report.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.createdAt}
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            You have not reported any Waste Yet
          </p>
        )}
      </div>
    </>
  );
};

export default Report;