// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "./ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Menu, Coins, Leaf, Bell, LogOut, LogIn } from "lucide-react";
// import { useAppStore } from "@/store/store";
// import { apiClient } from "@/lib/api-client";
// import {
//   GET_USER_INFO_ROUTE,
//   LOGOUT_ROUTE,
//   MARK_ALL_NOTIFICATION_READ_ROUTE,
//   MARK_NOTIFICATION_READ_ROUTE,
// } from "@/utils/constant";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { Badge } from "./ui/badge";

// const Header = ({ onMenuClick }) => {
//   const navigate = useNavigate();
//   const [balance, setBalance] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const { userInfo, setUserInfo } = useAppStore();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const login = () => {
//     navigate("/auth");
//   };

//   const logout = async () => {
//     try {
//       setIsSubmitting(true);
//       const response = await apiClient.get(LOGOUT_ROUTE, {
//         withCredentials: true,
//       });
//       if (response.status === 200) {
//         toast.success("Logged Out Successfully");
//         setUserInfo(null);
//       } else if (response.status === 500) {
//         toast.error("Internal Server Error");
//       }
//     } catch (error) {
//       toast.error("Error Logging Out");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         const response = await apiClient.get(GET_USER_INFO_ROUTE, {
//           withCredentials: true,
//         });
//         if (response.status === 200) {
//           setUserInfo(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching user info:", error);
//       }
//     }, 60000); // 1 minute interval
//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   async function handleNotificationClick(notificationId) {
//     try {
//       const response = await apiClient.patch(
//         MARK_NOTIFICATION_READ_ROUTE,
//         { notificationId: notificationId },
//         { withCredentials: true }
//       );
//       if (response.status === 200) {
//         setNotifications(notifications.filter((n) => n._id !== notificationId));
//       }
//     } catch (error) {
//       toast.error("Some Error Occured");
//       console.error("Error marking notification as read:", error);
//     }
//   }

//   async function markAllNotificationAsRead() {
//     try {
//       const response = await apiClient.get(MARK_ALL_NOTIFICATION_READ_ROUTE, {
//         withCredentials: true,
//       });
//       if (response.status === 200) {
//         setNotifications([]);
//         toast.success("All Notifications Marked as Read");
//       }
//     } catch (error) {
//       toast.error("Some Error Occured");
//       console.error("Error marking all notifications as read:", error);      
//     }
//   }
//   useEffect(() => {
//     if (userInfo) {
//       setBalance(userInfo.totalBalance);
//       setNotifications(userInfo.notification);
//     }
//   }, [userInfo]);

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//       <div className="flex items-center justify-between px-4 py-2">
//         <div className="flex items-center">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="mr-2 md:mr-4"
//             onClick={onMenuClick}
//           >
//             <Menu className="h-6 w-6" />
//           </Button>
//           <Link to="/" className="flex items-center">
//             <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
//             <div className="flex flex-col">
//               <span className="font-serif font-bold text-base md:text-lg text-gray-800">
//               WasteNest
//               </span>
//               <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">
//                 @Waste Management System
//               </span>
//             </div>
//           </Link>
//         </div>
//         <div className="flex items-center">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="mr-2 relative">
//                 <Bell className="h-5 w-5" />
//                 {notifications && notifications.length > 0 && (
//                   <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
//                     {notifications.length}
//                   </Badge>
//                 )}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-72 ">
//               {notifications && notifications.length > 0 ? (
//                 <div className="flex flex-col max-h-96 overflow-y-auto">
//                   {notifications.length > 2 && (
//                     <div className="flex justify-end p-2">
//                       <button
//                         onClick={markAllNotificationAsRead}
//                         className="text-xs text-blue-500 font-semibold hover:underline"
//                       >
//                         Mark all as read
//                       </button>
//                     </div>
//                   )}
//                   {notifications.map((notification) => (
//                     <DropdownMenuItem
//                       key={notification._id}
//                       onClick={() => handleNotificationClick(notification._id)}
//                       className="flex items-start gap-2 p-2 hover:bg-muted transition"
//                     >
//                       <div className="flex flex-col">
//                         <span className="text-sm text-gray-500 line-clamp-2">
//                           {notification.message}
//                         </span>
//                       </div>
//                     </DropdownMenuItem>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="p-4 text-center text-sm text-muted-foreground">
//                   No new notifications
//                 </div>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//           <div className="mr-2 md:mr-4 flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
//             <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
//             <span className="font-semibold text-sm md:text-base text-gray-800">
//               {balance}
//             </span>
//           </div>
//           {!!userInfo && userInfo.user ? ( // Ensure userInfo and user exist
//             <Button
//               onClick={logout}
//               className="bg-orange-600 hover:bg-orange-700 text-white text-sm md:text-base"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "submitting..." : "Logout"}
//               <LogOut className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
//             </Button>
//           ) : (
//             <Button
//               onClick={login}
//               className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base"
//             >
//               Login
//               <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
//             </Button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu, Coins, Leaf, Bell, LogOut, LogIn, User, Settings } from "lucide-react";
import { useAppStore } from "@/store/store";
import { apiClient } from "@/lib/api-client";
import {
  GET_USER_INFO_ROUTE,
  LOGOUT_ROUTE,
  MARK_ALL_NOTIFICATION_READ_ROUTE,
  MARK_NOTIFICATION_READ_ROUTE,
  HOST,
} from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { userInfo, setUserInfo } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = () => {
    navigate("/auth");
  };

  const logout = async () => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.get(LOGOUT_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success("Logged Out Successfully");
        setUserInfo(null);
      } else if (response.status === 500) {
        toast.error("Internal Server Error");
      }
    } catch (error) {
      toast.error("Error Logging Out");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }, 60000); // 1 minute interval
    return () => {
      clearInterval(interval);
    };
  }, []);

  async function handleNotificationClick(notificationId) {
    try {
      const response = await apiClient.patch(
        MARK_NOTIFICATION_READ_ROUTE,
        { notificationId: notificationId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setNotifications(notifications.filter((n) => n._id !== notificationId));
      }
    } catch (error) {
      toast.error("Some Error Occured");
      console.error("Error marking notification as read:", error);
    }
  }

  async function markAllNotificationAsRead() {
    try {
      const response = await apiClient.get(MARK_ALL_NOTIFICATION_READ_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setNotifications([]);
        toast.success("All Notifications Marked as Read");
      }
    } catch (error) {
      toast.error("Some Error Occured");
      console.error("Error marking all notifications as read:", error);      
    }
  }

  useEffect(() => {
    if (userInfo) {
      setBalance(userInfo.totalBalance);
      setNotifications(userInfo.notification);
    }
  }, [userInfo]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userInfo?.user?.name) {
      const nameParts = userInfo.user.name.trim().split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    if (userInfo?.user?.email) {
      return userInfo.user.email[0].toUpperCase();
    }
    return "U";
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (userInfo?.user?.name) {
      return userInfo.user.name;
    }
    return "User";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="flex items-center">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-1 md:mr-2" />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base md:text-lg text-gray-800">
              WasteNest
              </span>
              <span className="text-[8px] md:text-[10px] text-gray-500 -mt-1">
                @Waste Management System
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications && notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 ">
              {notifications && notifications.length > 0 ? (
                <div className="flex flex-col max-h-96 overflow-y-auto">
                  {notifications.length > 2 && (
                    <div className="flex justify-end p-2">
                      <button
                        onClick={markAllNotificationAsRead}
                        className="text-xs text-blue-500 font-semibold hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification._id)}
                      className="flex items-start gap-2 p-2 hover:bg-muted transition"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 line-clamp-2">
                          {notification.message}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Balance Display */}
          <div className="flex items-center bg-gray-100 rounded-full px-2 md:px-3 py-1">
            <Coins className="h-4 w-4 md:h-5 md:w-5 mr-1 text-green-500" />
            <span className="font-semibold text-sm md:text-base text-gray-800">
              {balance}
            </span>
          </div>

          {/* Profile Menu or Login Button */}
          {!!userInfo && userInfo.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-sm hover:bg-green-600 transition-colors overflow-hidden">
                    {userInfo.user.image ? (
                      <img 
                        src={`${HOST}${userInfo.user.image}`}
                        alt={getUserDisplayName()} 
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-white font-semibold text-sm">${getUserInitials()}</span>`;
                        }}
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">
                      {getUserDisplayName()}
                    </p>
                    {userInfo.user.email && (
                      <p className="text-xs text-muted-foreground truncate w-40">
                        {userInfo.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout} 
                  disabled={isSubmitting}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isSubmitting ? "Logging out..." : "Logout"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={login}
              className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base"
            >
              Login
              <LogIn className="ml-1 md:ml-2 h-4 w-4 md:h-5 md:w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;