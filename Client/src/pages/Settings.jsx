// Settings.jsx - Your settings page component
import React, { useState, useCallback, useMemo } from 'react';
import { Moon, Sun, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { CHANGE_PASSWORD_ROUTE } from "@/utils/constant";


const Settings = () => {
  const { settings, toggleSetting } = useSettings();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Memoized handlers to prevent recreating functions
  // const handleCurrentPasswordChange = useCallback((e) => {
  //   setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }));
  // }, []);

  // const handleNewPasswordChange = useCallback((e) => {
  //   setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
  // }, []);

  // const handleConfirmPasswordChange = useCallback((e) => {
  //   setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
  // }, []);

  const handlePasswordSubmit = async(e) => {
   e.preventDefault();
  
  // Validation
  if (!passwordData.currentPassword) {
    toast.error("Current password is required");
    return;
  }
  
  if (passwordData.newPassword.length < 4) {
    toast.error("New password must be at least 4 characters long");
    return;
  }
  
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  try {
    setIsSubmitting(true);
    
    const response = await apiClient.post(
      CHANGE_PASSWORD_ROUTE,
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      },
      { withCredentials: true }
    );
    
    if (response.status === 200) {
      toast.success("Password changed successfully!");
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
      
      // Hide password visibility toggles
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  } catch (error) {
    if (error.response) {
      toast.error(
        error.response?.data?.message || 
        error.response?.data || 
        "Failed to change password"
      );
    } else {
      toast.error("Network error. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
  };

  const SettingSection = ({ icon: Icon, title, children }) => (
    <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 mb-4 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-green-600" />
        </div>
        <h2 className={`text-lg font-semibold ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const ToggleSetting = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <p className={`font-medium ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
          {label}
        </p>
        {description && (
          <p className={`text-sm mt-1 ${settings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-green-500' : 'bg-gray-300'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const buttonClass = `w-full text-left py-3 px-4 rounded-lg transition-colors ${
    settings.darkMode 
      ? 'border border-gray-600 hover:bg-gray-700' 
      : 'border border-gray-300 hover:bg-gray-50'
  }`;

  const textClass = settings.darkMode ? 'text-white' : 'text-gray-800';
  const descClass = settings.darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
    settings.darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-800'
  }`;

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${settings.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className={`text-2xl font-bold ${textClass}`}>Settings</h1>
          <p className={descClass}>Manage your WasteNest preferences</p>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Appearance */}
        <SettingSection icon={settings.darkMode ? Moon : Sun} title="Appearance">
          <ToggleSetting
            label="Dark Mode"
            description="Switch between light and dark theme"
            checked={settings.darkMode}
            onChange={() => toggleSetting('darkMode')}
          />
        </SettingSection>

        {/* Account */}
        <SettingSection icon={User} title="Account">
          <button 
            onClick={() => navigate('/profile')}
            className={buttonClass}
          >
            <p className={`${textClass} font-medium`}>Edit Profile</p>
            <p className={`text-sm ${descClass} mt-1`}>Update your personal information</p>
          </button>

          <button 
            onClick={() => setShowChangePassword(!showChangePassword)}
            className={buttonClass}
          >
            <p className={`${textClass} font-medium`}>Change Password</p>
            <p className={`text-sm ${descClass} mt-1`}>Update your account password</p>
          </button>

          {/* Change Password Form */}
          {showChangePassword && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 p-4 border border-green-500 rounded-lg">
              <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className={inputClass}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className={`w-5 h-5 ${descClass}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${descClass}`} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className={inputClass}
                      required
                      minLength="4"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className={`w-5 h-5 ${descClass}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${descClass}`} />
                      )}
                    </button>
                  </div>
                  <p className={`text-xs mt-1 ${descClass}`}>
                    Must be at least 4 characters long
                  </p>
                </div>

                <div>
                  <label className={`block mb-2 text-sm font-medium ${textClass}`}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={inputClass}
                      required
                      minLength="4"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className={`w-5 h-5 ${descClass}`} />
                      ) : (
                        <Eye className={`w-5 h-5 ${descClass}`} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Changing Password..." : "Change Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                      settings.darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </SettingSection>

        {/* About */}
        <div className={`${settings.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm text-center`}>
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12L12 4Z"/>
              </svg>
            </div>
          </div>
          <h3 className={`text-lg font-semibold mb-1 ${textClass}`}>WasteNest v1.0.0</h3>
          <p className={`text-sm mb-4 ${descClass}`}>Making waste management efficient and rewarding</p>
          <div className="flex gap-4 justify-center text-sm">
            <button className="text-green-600 hover:underline">Terms of Service</button>
            <button className="text-green-600 hover:underline">Privacy Policy</button>
            <button className="text-green-600 hover:underline">Help Center</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;