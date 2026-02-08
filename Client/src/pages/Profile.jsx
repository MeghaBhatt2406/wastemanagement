import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, ArrowLeft, Save, Loader2, User, Mail, Coins, Calendar, Phone, MapPin, Heart, ArrowUpRight, ArrowDownRight, TrendingUp, Award } from "lucide-react";
import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/api-client";
import { UPDATE_USER_PROFILE_ROUTE, HOST, FETCH_TRANSACTIONS_REWARD_ROUTE } from "@/utils/constant";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    hobbies: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalRedeemed: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    const fetchAndSetProfile = async () => {
      try {
        // Fetch fresh profile data
        const response = await apiClient.get(`${HOST}/api/user/profile`, {
          withCredentials: true,
        });
        
        if (response.status === 200 && response.data?.user) {
          const userData = response.data.user;
          
          // Split the name field into firstName and lastName
          const fullName = userData.name || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          
          setFormData({
            firstName: firstName,
            lastName: lastName,
            email: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            address: userData.address || "",
            hobbies: userData.hobbies || "",
          });
          
          if (userData.image) {
            setImagePreview(`${HOST}${userData.image}`);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        
        // Fallback to userInfo if API call fails
        if (userInfo?.user) {
          const fullName = userInfo.user.name || "";
          const nameParts = fullName.trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          
          setFormData({
            firstName: firstName,
            lastName: lastName,
            email: userInfo.user.email || "",
            phoneNumber: userInfo.user.phoneNumber || "",
            address: userInfo.user.address || "",
            hobbies: userInfo.user.hobbies || "",
          });
          
          if (userInfo.user.image) {
            setImagePreview(`${HOST}/${userInfo.user.image}`);
          }
        }
      }
    };
    
    fetchAndSetProfile();
  }, [userInfo]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        const response = await apiClient.get(FETCH_TRANSACTIONS_REWARD_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data) {
          const trans = response.data.transactions;
          trans.forEach((transaction) => {
            transaction.date = transaction.date.split("T")[0];
          });
          
          // Get only the 5 most recent transactions
          const recentTransactions = trans.slice(0, 5);
          setTransactions(recentTransactions);
          
          // Calculate stats
          const earned = trans
            .filter(t => t.type.startsWith("earned"))
            .reduce((sum, t) => sum + t.amount, 0);
          
          const redeemed = trans
            .filter(t => t.type === "redeemed_reward")
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          setStats({
            totalEarned: earned,
            totalRedeemed: redeemed,
            totalTransactions: trans.length
          });
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setTransactionsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    if (formData.email) {
      return formData.email[0].toUpperCase();
    }
    return "U";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    try {
      setIsLoading(true);
      
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      
      const updateFormData = new FormData();
      updateFormData.append("name", fullName);
      updateFormData.append("phoneNumber", formData.phoneNumber || "");
      updateFormData.append("address", formData.address || "");
      updateFormData.append("hobbies", formData.hobbies || "");
      
      if (selectedFile) {
        updateFormData.append("profile-image", selectedFile);
      }

      const response = await apiClient.patch(
        UPDATE_USER_PROFILE_ROUTE,
        updateFormData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data) {
        setUserInfo(response.data);
        toast.success("Profile updated successfully");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-500 mb-4">Please log in to view your profile</p>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8">
                <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
                <p className="text-green-50 mt-1">
                  Manage your account information and profile picture
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full overflow-hidden bg-green-500 flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getUserInitials()
                        )}
                      </div>
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full cursor-pointer transition-colors shadow-lg"
                      >
                        <Camera className="h-5 w-5" />
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Click the camera icon to upload a new photo
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            First Name <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            Last Name <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-6">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          disabled
                          className="bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-sm text-gray-500">Email cannot be changed</p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                      
                      <div className="space-y-2">
                        <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          Phone Number
                        </label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div className="space-y-2 mt-6">
                        <label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your address"
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                      
                      <div className="space-y-2">
                        <label htmlFor="hobbies" className="text-sm font-medium text-gray-700 flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-gray-500" />
                          Hobbies & Interests
                        </label>
                        <textarea
                          id="hobbies"
                          name="hobbies"
                          value={formData.hobbies}
                          onChange={handleInputChange}
                          placeholder="Tell us about your hobbies and interests"
                          className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end mt-8">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Transactions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Info Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Account Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Account Type
                    </span>
                    <span className="font-medium text-gray-800 capitalize">
                      {userInfo.user.role || "User"}
                    </span>
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Coins className="h-4 w-4 mr-2" />
                      Total Balance
                    </span>
                    <span className="font-semibold text-green-600">
                      {userInfo.totalBalance} coins
                    </span>
                  </div>
                  <div className="border-t border-gray-100"></div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member Since
                    </span>
                    <span className="font-medium text-gray-800">
                      {userInfo.user.createdAt 
                        ? new Date(userInfo.user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Stats Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Transaction Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Total Earned</span>
                  </div>
                  <span className="font-bold text-green-600">{stats.totalEarned}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-red-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Total Redeemed</span>
                  </div>
                  <span className="font-bold text-red-600">{stats.totalRedeemed}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700">Transactions</span>
                  </div>
                  <span className="font-bold text-blue-600">{stats.totalTransactions}</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
              </div>
              <div className="p-4">
                {transactionsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="flex items-center gap-3">
                          {transaction.type.startsWith("earned") ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            transaction.type.startsWith("earned")
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type.startsWith("earned") && "+"}
                          {transaction.amount}
                        </span>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => navigate("/reward")}
                    >
                      View All Transactions
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8 text-sm">
                    No transactions yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;