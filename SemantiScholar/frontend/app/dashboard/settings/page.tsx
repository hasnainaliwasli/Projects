"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Settings, User, Shield, Key, Sun, Moon, Monitor, Loader2, Camera } from "lucide-react";
import { Container, Card, Button } from "@/components/ui";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

type SettingsTab = "profile" | "security";

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "security", label: "Security", icon: <Shield size={18} /> },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", profileName);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const res = await api.put("/auth/profile", formData);
      const data = res.data.data;
      updateUser({ name: data.name, avatar: data.avatar });
      setAvatarFile(null);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <Container size="lg">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
          <Settings className="text-primary-500" />
          Settings
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          Manage your account preferences and system settings.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-950/30 dark:text-primary-400"
                  : "text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-2">
          {/* ─── Profile Tab ─── */}
          {activeTab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6 border-b border-surface-200 dark:border-surface-800 pb-4">
                  Profile Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    {/* Avatar with upload overlay */}
                    <div className="relative group">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="h-16 w-16 rounded-full object-cover shadow-sm border-2 border-surface-200 dark:border-surface-700"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera size={18} className="text-white" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Change Avatar
                      </Button>
                      <p className="text-[11px] text-surface-400 mt-1">JPG, PNG. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full h-10 rounded-xl border border-surface-200 bg-white px-3 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-dark-card dark:focus:ring-primary-900 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ""}
                        disabled
                        className="w-full h-10 rounded-xl border border-surface-200 bg-surface-50 text-surface-500 px-3 text-sm dark:border-dark-border dark:bg-surface-800 dark:text-surface-400 outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                      {isSavingProfile ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ─── Security Tab ─── */}
          {activeTab === "security" && (
            <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-6 border-b border-surface-200 dark:border-surface-800 pb-4 flex items-center gap-2">
                  <Key size={18} className="text-surface-400" />
                  Change Password
                </h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-10 rounded-xl border border-surface-200 bg-white px-3 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-dark-card dark:focus:ring-primary-900 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-10 rounded-xl border border-surface-200 bg-white px-3 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-dark-card dark:focus:ring-primary-900 outline-none transition-all"
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      disabled={isChangingPassword || !currentPassword || !newPassword}
                      onClick={async () => {
                        setIsChangingPassword(true);
                        try {
                          await api.put("/auth/change-password", { currentPassword, newPassword });
                          toast.success("Password updated successfully!");
                          setCurrentPassword("");
                          setNewPassword("");
                        } catch (error: any) {
                          toast.error(error.response?.data?.message || "Failed to update password");
                        } finally {
                          setIsChangingPassword(false);
                        }
                      }}
                    >
                      {isChangingPassword ? <><Loader2 size={16} className="animate-spin mr-2" /> Updating...</> : "Update Password"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Container>
  );
}
