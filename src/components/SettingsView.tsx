import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  LogOut,
  Plus,
  Share2,
  Handshake,
  FileText,
} from "lucide-react";
import { Pet } from "../types";
import AddPetQuizModal from "./AddPetQuizModal";

// Helper to determine species, age, sex, and emoji for pet tracked plaque
export function getPetTrackedDetails(pet: Pet): {
  species: string;
  age: string;
  sex: string;
  emoji: string;
} {
  let species = pet.species;
  if (!species) {
    const t = (pet.type || "").toLowerCase();
    const b = (pet.breed || "").toLowerCase();
    if (t === "dog" || b.includes("собака") || b.includes("терьер")) species = "Dog";
    else if (t === "cat" || b.includes("кот") || b.includes("кошка") || b.includes("вислоухая")) species = "Cat";
    else if (t === "rabbit") species = "Rabbit";
    else if (t === "rodent" || b.includes("хомяк")) species = "Rodent";
    else if (t === "bird" || t === "parrot" || b.includes("попугай")) species = "Bird";
    else if (t === "reptile" || b.includes("черепаха")) species = "Reptile";
    else if (t === "another" || t === "unicorn") species = "Another";
    else species = "Dog";
  }

  let age = pet.age || "1-3";
  if (age === "1.5 года" || age === "2 года") age = "1-3";
  else if (age === "8 месяцев") age = "Under 1";

  let sex = pet.sex || "Male";

  let emoji = pet.emoji;
  if (!emoji) {
    const s = species.toLowerCase();
    if (s === "dog") emoji = "🐶";
    else if (s === "cat") emoji = "🐱";
    else if (s === "rabbit") emoji = "🐰";
    else if (s === "rodent") emoji = "🐹";
    else if (s === "bird") emoji = "🐦";
    else if (s === "reptile") emoji = "🐢";
    else if (s === "another") emoji = "🦄";
    else emoji = "🐾";
  }

  return { species, age, sex, emoji };
}

// Classic iOS SF Symbol solid filled profile (human person) icon, matching Groups member avatar
export const ClassicFilledUserIcon = ({ className = "w-7 h-7 text-[#8E8E93] dark:text-[#98989D]" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head */}
    <circle cx="12" cy="7.5" r="4.2" />
    {/* Shoulders / Torso */}
    <path d="M12 13.5C7.2 13.5 3.5 17 3.5 21a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1c0-4-3.7-7.5-8.5-7.5z" />
  </svg>
);

export type ThemeMode = "system" | "dark" | "light";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface SettingsViewProps {
  currentLanguage?: string;
  animateEntrance?: boolean;
  pets?: Pet[];
  activePetId?: string;
  onSelectPet?: (petId: string) => void;
  onAddPet?: (newPet: Pet) => void;
}

export default function SettingsView({
  currentLanguage = "ru",
  animateEntrance = false,
  pets = [],
  activePetId = "dog",
  onSelectPet,
  onAddPet,
}: SettingsViewProps) {
  // Theme state: "system" | "dark" | "light"
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem("pethealth_theme_mode") as ThemeMode;
      if (saved === "system" || saved === "dark" || saved === "light") {
        return saved;
      }
    } catch {
      // ignore
    }
    return "system";
  });

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("pethealth_user_profile");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Account modal state
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  // Add Pet Quiz modal state
  const [showAddPetQuiz, setShowAddPetQuiz] = useState(false);

  // Information section modals & toast
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PetHealth Tracker AI",
          text: "Check out PetHealth Tracker AI - Track your pet's health with AI!",
          url: window.location.href,
        });
        return;
      } catch (e) {
        // user cancelled or share failed, fallback to copy
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2200);
    } catch {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2200);
    }
  };

  // Filter out demo/dummy pets if user has created/tracked real pets
  const customPets = (pets || []).filter((p) => p.isCustom);
  const displayPets = customPets.length > 0 ? customPets : (pets || []);

  const handleSelectPetProfile = (id: string) => {
    try {
      localStorage.setItem("pethealth_active_pet_id", id);
    } catch (e) {}
    if (onSelectPet) {
      onSelectPet(id);
    }
    if (navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const handleAddNewPet = (newPet: Pet) => {
    try {
      localStorage.setItem("pethealth_active_pet_id", newPet.id);
    } catch (e) {}
    if (onAddPet) {
      onAddPet(newPet);
    }
    if (onSelectPet) {
      onSelectPet(newPet.id);
    }
  };

  // Apply theme dynamically to documentElement
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      let isDark = false;

      if (themeMode === "dark") {
        isDark = true;
      } else if (themeMode === "light") {
        isDark = false;
      } else {
        // System preference
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      if (isDark) {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }
    };

    applyTheme();
    localStorage.setItem("pethealth_theme_mode", themeMode);

    // If system, listen for OS theme changes
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [themeMode]);

  const handleSelectTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleAppleSignIn = () => {
    const newProfile: UserProfile = {
      name: "Apple User",
      email: "user@icloud.com",
    };
    setUserProfile(newProfile);
    try {
      localStorage.setItem("pethealth_user_profile", JSON.stringify(newProfile));
    } catch (e) {}
    setShowAccountModal(false);
  };

  const handleGoogleSignIn = () => {
    const newProfile: UserProfile = {
      name: "Google User",
      email: "user@gmail.com",
    };
    setUserProfile(newProfile);
    try {
      localStorage.setItem("pethealth_user_profile", JSON.stringify(newProfile));
    } catch (e) {}
    setShowAccountModal(false);
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem("pethealth_user_profile");
    setShowAccountModal(false);
  };

  return (
    <div className="w-full max-w-md min-h-[calc(100vh-140px)] flex flex-col justify-start select-none pb-24">
      {/* 1. Header: Left top text "Settings" */}
      <div className="w-full flex items-center justify-between mb-6 px-1">
        <h1 className="text-[28px] sm:text-[30px] font-bold tracking-tight text-[#1c1c1e] dark:text-white leading-none font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,sans-serif]">
          Settings
        </h1>
      </div>

      {/* 2. Account Section */}
      <motion.div
        initial={animateEntrance ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.05 }}
        className="w-full flex flex-col mb-6 px-1"
      >
        {/* Small gray label "Account" */}
        <span className="text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D] tracking-tight ml-1 mb-2 select-none">
          Account
        </span>

        {/* Plaque: Avatar on left, "Create a free account" and "or log in to system" on right */}
        <button
          type="button"
          onClick={() => {
            setAuthMode("signup");
            setShowAccountModal(true);
          }}
          className="w-full bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] rounded-[24px] p-4 sm:p-5 border border-black/[0.04] dark:border-white/[0.08] shadow-xs flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all text-left group"
        >
          <div className="flex items-center space-x-3.5 min-w-0">
            {/* Avatar or Profile Icon */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#E5E5EA] dark:bg-[#2C2C2E] flex items-center justify-center flex-shrink-0 text-[#8E8E93] dark:text-[#98989D] border border-black/5 dark:border-white/10">
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ClassicFilledUserIcon className="w-7 h-7 text-[#8E8E93] dark:text-[#98989D]" />
              )}
            </div>

            {/* Account text info */}
            <div className="flex flex-col min-w-0">
              {userProfile ? (
                <>
                  <span className="text-[16px] sm:text-[17px] font-semibold text-[#1C1C1E] dark:text-white tracking-tight leading-snug truncate">
                    {userProfile.name}
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-[#8E8E93] dark:text-[#98989D] tracking-tight mt-0.5 leading-snug truncate">
                    {userProfile.email}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[16px] sm:text-[17px] font-semibold text-[#1C1C1E] dark:text-white tracking-tight leading-snug">
                    Create a free account
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-[#8E8E93] dark:text-[#98989D] tracking-tight mt-0.5 leading-snug">
                    or log in to system
                  </span>
                </>
              )}
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-[#C7C7CC] dark:text-[#98989D] group-hover:text-[#8E8E93] transition-colors flex-shrink-0 ml-2" strokeWidth={2.4} />
        </button>
      </motion.div>

      {/* 2.5 Pets Tracked Section */}
      <motion.div
        initial={animateEntrance ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.08 }}
        className="w-full flex flex-col mb-6 px-1"
      >
        {/* Left-aligned gray label "Pets tracked" */}
        <span className="text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D] tracking-tight ml-1 mb-2 select-none">
          Pets tracked
        </span>

        {/* Tracked Pets List / Plaques */}
        <div className="flex flex-col space-y-2.5 w-full">
          {displayPets.map((pet) => {
            const { species, age, sex, emoji } = getPetTrackedDetails(pet);
            const subtitle = `${species}, ${age}, ${sex}`;
            const isActive = pet.id === activePetId;

            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => handleSelectPetProfile(pet.id)}
                className="w-full bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] rounded-[24px] p-4 sm:p-4.5 border border-black/[0.04] dark:border-white/[0.08] shadow-xs flex items-center justify-between cursor-pointer text-left group active:scale-[0.99] transition-all"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Pet Emoji */}
                  <div className="w-12 h-12 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center flex-shrink-0 text-[26px] border border-black/5 dark:border-white/10 shadow-inner">
                    <span>{emoji}</span>
                  </div>

                  {/* Pet Name & Subtext: «[Кто питомец], [Сколько лет], [Какой пол питомца]» */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[16px] sm:text-[17px] font-semibold text-[#1C1C1E] dark:text-white tracking-tight leading-snug truncate">
                      {pet.name}
                    </span>
                    <span className="text-[13px] sm:text-[14px] text-[#8E8E93] dark:text-[#98989D] tracking-tight mt-0.5 leading-snug truncate">
                      {subtitle}
                    </span>
                  </div>
                </div>

                {/* Checkmark switch toggle on right (identical to quiz) */}
                <div
                  className={`relative w-[26px] h-[26px] rounded-full border-[1.5px] transition-colors duration-200 overflow-hidden flex items-center justify-center flex-shrink-0 ml-3 ${
                    isActive
                      ? "border-transparent"
                      : "border-zinc-300 dark:border-white/20 bg-zinc-50 dark:bg-black/40 group-hover:border-zinc-400 dark:group-hover:border-white/35 shadow-2xs"
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.18,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className="absolute inset-0 bg-black dark:bg-white rounded-full"
                  />
                  <svg
                    className="relative z-10 w-3.5 h-3.5 text-white dark:text-black pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.polyline
                      points="20 6 9 17 4 12"
                      initial={false}
                      animate={{
                        pathLength: isActive ? 1 : 0,
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.16,
                        ease: "easeOut",
                        delay: isActive ? 0.04 : 0,
                      }}
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Button "+ Add a Pet" */}
        <button
          type="button"
          onClick={() => setShowAddPetQuiz(true)}
          className="w-full mt-2.5 py-3.5 px-5 rounded-[22px] bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] shadow-xs hover:scale-[1.005] active:scale-[0.99] text-[#1C1C1E] dark:text-white font-semibold text-[15px] sm:text-[16px] flex items-center justify-center space-x-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add a Pet</span>
        </button>
      </motion.div>

      {/* 3. View Section */}
      <motion.div
        initial={animateEntrance ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.1 }}
        className="w-full flex flex-col px-1"
      >
        {/* Small gray label "View" */}
        <span className="text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D] tracking-tight ml-1 mb-2 select-none">
          View
        </span>

        {/* 3 Plaques in a row: 1. System, 2. Dark, 3. Light */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {/* 1. System Plaque */}
          <button
            type="button"
            onClick={() => handleSelectTheme("system")}
            className={`rounded-[22px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none min-h-[102px] bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] ${
              themeMode === "system"
                ? "border-2 border-[#1C1C1E] dark:border-white shadow-sm scale-[1.02]"
                : "border border-black/[0.04] dark:border-white/[0.08] hover:scale-[1.01]"
            }`}
          >
            <div
              className={`mb-2.5 transition-colors ${
                themeMode === "system"
                  ? "text-[#1C1C1E] dark:text-white"
                  : "text-[#8E8E93] dark:text-[#98989D]"
              }`}
            >
              <SettingsIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
            </div>
            <span
              className={`text-[14px] sm:text-[15px] font-semibold tracking-tight ${
                themeMode === "system"
                  ? "text-[#1C1C1E] dark:text-white"
                  : "text-[#8E8E93] dark:text-[#98989D]"
              }`}
            >
              System
            </span>
          </button>

          {/* 2. Dark Plaque */}
          <button
            type="button"
            onClick={() => handleSelectTheme("dark")}
            className={`rounded-[22px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none min-h-[102px] bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] ${
              themeMode === "dark"
                ? "border-2 border-[#1C1C1E] dark:border-white shadow-sm scale-[1.02]"
                : "border border-black/[0.04] dark:border-white/[0.08] hover:scale-[1.01]"
            }`}
          >
            <div
              className={`mb-2.5 transition-colors ${
                themeMode === "dark"
                  ? "text-[#1C1C1E] dark:text-white"
                  : "text-[#8E8E93] dark:text-[#98989D]"
              }`}
            >
              <Moon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
            </div>
            <span
              className={`text-[14px] sm:text-[15px] font-semibold tracking-tight ${
                themeMode === "dark"
                  ? "text-[#1C1C1E] dark:text-white"
                  : "text-[#8E8E93] dark:text-[#98989D]"
              }`}
            >
              Dark
            </span>
          </button>

          {/* 3. Light Plaque */}
          <button
            type="button"
            onClick={() => handleSelectTheme("light")}
            className={`rounded-[22px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none min-h-[102px] bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] ${
              themeMode === "light"
                ? "border-2 border-[#1C1C1E] dark:border-white shadow-sm scale-[1.02]"
                : "border border-black/[0.04] dark:border-white/[0.08] hover:scale-[1.01]"
            }`}
          >
            <div
              className={`mb-2.5 transition-colors ${
                themeMode === "light"
                  ? "text-[#1C1C1E] dark:text-white"
                  : "text-[#8E8E93] dark:text-[#98989D]"
              }`}
            >
              <Sun className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
            </div>
            <span
              className={`text-[14px] sm:text-[15px] font-semibold tracking-tight ${
                themeMode === "light"
                  ? "text-[#1C1C1E] dark:text-white"
                  : "text-[#8E8E93] dark:text-[#98989D]"
              }`}
            >
              Light
            </span>
          </button>
        </div>
      </motion.div>

      {/* 4. Information Section */}
      <motion.div
        initial={animateEntrance ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.14 }}
        className="w-full flex flex-col mt-6 px-1"
      >
        <span className="text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D] tracking-tight ml-1 mb-2 select-none">
          Information
        </span>

        <div className="flex flex-col space-y-2 w-full">
          {/* Plaque 1: Share this app */}
          <button
            type="button"
            onClick={handleShareApp}
            className="w-full bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] rounded-[22px] py-3.5 px-4.5 border border-black/[0.04] dark:border-white/[0.08] shadow-xs flex items-center justify-between cursor-pointer hover:scale-[1.005] active:scale-[0.99] transition-all text-left group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Share2 className="w-5 h-5 text-[#1C1C1E] dark:text-white shrink-0" strokeWidth={2} />
              <span className="text-[15px] sm:text-[16px] font-semibold text-[#1C1C1E] dark:text-white tracking-tight truncate">
                Share this app
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC] dark:text-[#98989D] group-hover:text-[#8E8E93] transition-colors shrink-0 ml-2" strokeWidth={2.4} />
          </button>

          {/* Plaque 2: Privacy Policy */}
          <button
            type="button"
            onClick={() => setShowPrivacyModal(true)}
            className="w-full bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] rounded-[22px] py-3.5 px-4.5 border border-black/[0.04] dark:border-white/[0.08] shadow-xs flex items-center justify-between cursor-pointer hover:scale-[1.005] active:scale-[0.99] transition-all text-left group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Handshake className="w-5 h-5 text-[#1C1C1E] dark:text-white shrink-0" strokeWidth={2} />
              <span className="text-[15px] sm:text-[16px] font-semibold text-[#1C1C1E] dark:text-white tracking-tight truncate">
                Privacy Policy
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC] dark:text-[#98989D] group-hover:text-[#8E8E93] transition-colors shrink-0 ml-2" strokeWidth={2.4} />
          </button>

          {/* Plaque 3: Terms of use */}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="w-full bg-white dark:bg-gradient-to-b dark:from-[#202022] dark:to-[#1C1C1E] rounded-[22px] py-3.5 px-4.5 border border-black/[0.04] dark:border-white/[0.08] shadow-xs flex items-center justify-between cursor-pointer hover:scale-[1.005] active:scale-[0.99] transition-all text-left group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <FileText className="w-5 h-5 text-[#1C1C1E] dark:text-white shrink-0" strokeWidth={2} />
              <span className="text-[15px] sm:text-[16px] font-semibold text-[#1C1C1E] dark:text-white tracking-tight truncate">
                Terms of use
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC] dark:text-[#98989D] group-hover:text-[#8E8E93] transition-colors shrink-0 ml-2" strokeWidth={2.4} />
          </button>
        </div>
      </motion.div>

      {/* Share Feedback Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-black/90 dark:bg-white/95 text-white dark:text-black text-[14px] font-semibold shadow-xl flex items-center space-x-2 pointer-events-none"
          >
            <Check className="w-4 h-4 text-[#30D158]" strokeWidth={2.5} />
            <span>Link copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Login / Registration Bottom Sheet Popup */}
      <AnimatePresence>
        {showAccountModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center select-none">
            {/* Translucent Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setShowAccountModal(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px] cursor-pointer"
            />

            {/* Popup Sheet */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragSnapToOrigin={true}
              dragElastic={{ top: 0.05, bottom: 0.95 }}
              onDragEnd={(_event, info) => {
                if (info.offset.y > 45 || info.velocity.y > 120) {
                  setShowAccountModal(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 34,
                stiffness: 380,
                mass: 0.85,
              }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-t-[64px] px-6 pt-6 pb-9 sm:pb-8 shadow-[0_-16px_48px_rgba(0,0,0,0.22)] dark:shadow-[0_-16px_48px_rgba(0,0,0,0.6)] flex flex-col pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
              onClick={(e) => e.stopPropagation()}
            >
              {userProfile ? (
                /* Logged In View */
                <div className="flex flex-col items-center text-center pt-1">
                  <div className="w-full flex items-center justify-between mb-3">
                    <button
                      type="button"
                      onClick={() => setShowAccountModal(false)}
                      className="modal-circle-btn w-12 h-12 rounded-full bg-white dark:!bg-black shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:shadow-none border border-black/[0.03] dark:border-white/10 flex items-center justify-center hover:bg-zinc-50 dark:hover:!bg-zinc-900 active:scale-95 transition-all cursor-pointer flex-shrink-0 outline-none focus:outline-none"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5 text-black dark:text-white" strokeWidth={2} />
                    </button>
                    <div className="w-12 h-12" />
                  </div>

                  <div className="w-16 h-16 rounded-full bg-[#E5E5EA] dark:bg-[#2C2C2E] flex items-center justify-center mb-3 text-[#8E8E93] dark:text-[#98989D] border border-black/5 dark:border-white/10 overflow-hidden">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ClassicFilledUserIcon className="w-9 h-9 text-[#8E8E93] dark:text-[#98989D]" />
                    )}
                  </div>
                  <h3 className="text-[20px] font-bold text-[#1C1C1E] dark:text-white tracking-tight">
                    {userProfile.name}
                  </h3>
                  <p className="text-[14px] text-[#8E8E93] dark:text-[#98989D] tracking-tight mt-0.5 mb-6">
                    {userProfile.email}
                  </p>

                  <div className="w-full p-3.5 rounded-[18px] bg-[#F2F2F7] dark:bg-[#19191B] flex items-center space-x-3 mb-6 border border-transparent dark:border-white/[0.06]">
                    <Check className="w-5 h-5 text-[#30D158] flex-shrink-0" />
                    <span className="text-[13px] text-[#1C1C1E] dark:text-white font-medium text-left">
                      Account synchronized with local database
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full py-3.5 rounded-[18px] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/15 active:bg-[#FF3B30]/20 text-[#FF3B30] font-semibold text-[15px] flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                /* Create Account / Log in View */
                <div className="w-full flex flex-col pt-1">
                  {/* Top Row: Left Circle Button (X or Back Arrow) & Right Small 50px Button */}
                  <div className="w-full flex items-center justify-between mb-4">
                    {/* Left Circle Button (styled matching Streak close circle): X when in signup, Back arrow when in login */}
                    <button
                      type="button"
                      onClick={() => {
                        if (authMode === "login") {
                          setAuthMode("signup");
                        } else {
                          setShowAccountModal(false);
                        }
                      }}
                      className="modal-circle-btn w-12 h-12 rounded-full bg-white dark:!bg-black shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:shadow-none border border-black/[0.03] dark:border-white/10 flex items-center justify-center hover:bg-zinc-50 dark:hover:!bg-zinc-900 active:scale-95 transition-all cursor-pointer flex-shrink-0 outline-none focus:outline-none shrink-0"
                      aria-label={authMode === "login" ? "Back to Create Account" : "Close"}
                    >
                      <AnimatePresence mode="wait">
                        {authMode === "signup" ? (
                          <motion.div
                            key="close-icon"
                            initial={{ opacity: 0, rotate: -45, scale: 0.85 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 45, scale: 0.85 }}
                            transition={{ duration: 0.16 }}
                            className="flex items-center justify-center"
                          >
                            <X className="w-5 h-5 text-black dark:text-white" strokeWidth={2} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="back-icon"
                            initial={{ opacity: 0, x: 3, scale: 0.85 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -3, scale: 0.85 }}
                            transition={{ duration: 0.16 }}
                            className="flex items-center justify-center"
                          >
                            <ChevronLeft className="w-5 h-5 text-black dark:text-white" strokeWidth={2.4} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* Right Small 50px Rounded Pill Button (height matching the left button: h-12) */}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode((prev) => (prev === "signup" ? "login" : "signup"));
                      }}
                      className="modal-toggle-btn h-12 px-5 rounded-[50px] bg-white dark:!bg-black shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:shadow-none border border-black/[0.03] dark:border-white/10 flex items-center justify-center hover:bg-zinc-50 dark:hover:!bg-zinc-900 active:scale-95 transition-all cursor-pointer font-semibold text-[15px] text-black dark:text-white shrink-0 outline-none focus:outline-none"
                    >
                      <div className="relative w-[60px] h-5 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={authMode}
                            initial={{ y: authMode === "login" ? 14 : -14, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: authMode === "login" ? -14 : 14, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="whitespace-nowrap font-semibold text-[15px] text-black dark:text-white leading-none"
                          >
                            {authMode === "signup" ? "Log in" : "Sign up"}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </button>
                  </div>

                  {/* Heading: Create Account or Log in (No subtext!) */}
                  <div className="w-full flex flex-col items-center justify-center pt-2 pb-6 text-center">
                    <div className="relative h-9 flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.h3
                          key={authMode}
                          initial={{ y: authMode === "login" ? 18 : -18, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: authMode === "login" ? -18 : 18, opacity: 0 }}
                          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[28px] sm:text-[30px] font-bold tracking-tight text-[#1C1C1E] dark:text-white leading-tight whitespace-nowrap"
                        >
                          {authMode === "signup" ? "Create Account" : "Log in"}
                        </motion.h3>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Apple & Google Sign-In Buttons */}
                  <div className="w-full flex flex-col items-center gap-3">
                    {/* Black button: Apple (Fixed width content to guarantee stationary icon) */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAppleSignIn}
                      className="apple-auth-btn keep-black-bg w-full py-[18px] text-[17px] font-bold rounded-[50px] !bg-black hover:!bg-zinc-900 !text-white active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-none border border-transparent dark:border-white/15"
                      style={{ backgroundColor: "#000000", color: "#ffffff" }}
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 fill-white text-white shrink-0 mr-3" viewBox="0 0 384 512">
                          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-15 69.5-34.3z" />
                        </svg>
                        <div className="relative w-[172px] h-6 flex items-center justify-start overflow-hidden">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={authMode}
                              initial={{ y: authMode === "login" ? 16 : -16, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: authMode === "login" ? -16 : 16, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="text-white !text-white font-bold text-[17px] whitespace-nowrap leading-none"
                              style={{ color: "#ffffff" }}
                            >
                              {authMode === "signup" ? "Sign in with Apple" : "Log in with Apple"}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.button>

                    {/* White button: Google with Black text (Fixed width content to guarantee stationary icon) */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleSignIn}
                      className="google-auth-btn keep-white keep-black w-full py-[18px] text-[17px] font-bold rounded-[50px] !bg-white hover:!bg-zinc-100 border border-zinc-300 dark:border-white/20 !text-black active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer shadow-none"
                      style={{ backgroundColor: "#ffffff", color: "#000000" }}
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 shrink-0 mr-3" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <div className="relative w-[184px] h-6 flex items-center justify-start overflow-hidden">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={authMode}
                              initial={{ y: authMode === "login" ? 16 : -16, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: authMode === "login" ? -16 : 16, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="keep-black text-black !text-black font-bold text-[17px] whitespace-nowrap leading-none"
                              style={{ color: "#000000" }}
                            >
                              {authMode === "signup" ? "Sign in with Google" : "Log in with Google"}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Bottom Sheet */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setShowPrivacyModal(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px] cursor-pointer"
            />
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragSnapToOrigin={true}
              dragElastic={{ top: 0.05, bottom: 0.95 }}
              onDragEnd={(_event, info) => {
                if (info.offset.y > 45 || info.velocity.y > 120) {
                  setShowPrivacyModal(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 34, stiffness: 380, mass: 0.85 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-t-[64px] px-6 pt-6 pb-9 sm:pb-8 shadow-[0_-16px_48px_rgba(0,0,0,0.22)] dark:shadow-[0_-16px_48px_rgba(0,0,0,0.6)] flex flex-col pointer-events-auto max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between mb-3 cursor-grab active:cursor-grabbing touch-none select-none">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="modal-circle-btn w-12 h-12 rounded-full bg-white dark:!bg-black shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:shadow-none border border-black/[0.03] dark:border-white/10 flex items-center justify-center hover:bg-zinc-50 dark:hover:!bg-zinc-900 active:scale-95 transition-all cursor-pointer flex-shrink-0 outline-none focus:outline-none"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-black dark:text-white" strokeWidth={2} />
                </button>
                <div className="w-12 h-12" />
              </div>

              <div className="flex items-center space-x-3 mb-3">
                <Handshake className="w-6 h-6 text-[#1C1C1E] dark:text-white shrink-0" strokeWidth={2} />
                <h3 className="text-[24px] font-bold text-[#1C1C1E] dark:text-white tracking-tight">
                  Privacy Policy
                </h3>
              </div>

              <div className="text-[14px] text-[#8E8E93] dark:text-[#98989D] space-y-3 leading-relaxed mb-6">
                <p>
                  <strong className="text-[#1C1C1E] dark:text-white">Local-First Storage:</strong> Your pet's health metrics, veterinary appointments, care logs, and notes are primarily stored directly on your local device.
                </p>
                <p>
                  <strong className="text-[#1C1C1E] dark:text-white">Photo & Camera Usage:</strong> Camera access and pet photos uploaded for AI screening are strictly used to evaluate symptoms (eyes, skin, teeth, posture). We do not use your pet photos for external advertising or third-party tracking.
                </p>
                <p>
                  <strong className="text-[#1C1C1E] dark:text-white">Encrypted Sync:</strong> If you connect an account, your profile data is transmitted securely via encrypted connections.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-4 rounded-[50px] bg-black dark:bg-white text-white dark:text-black font-bold text-[16px] active:scale-[0.98] transition-all cursor-pointer"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms of Use Bottom Sheet */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setShowTermsModal(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px] cursor-pointer"
            />
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragSnapToOrigin={true}
              dragElastic={{ top: 0.05, bottom: 0.95 }}
              onDragEnd={(_event, info) => {
                if (info.offset.y > 45 || info.velocity.y > 120) {
                  setShowTermsModal(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 34, stiffness: 380, mass: 0.85 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-t-[64px] px-6 pt-6 pb-9 sm:pb-8 shadow-[0_-16px_48px_rgba(0,0,0,0.22)] dark:shadow-[0_-16px_48px_rgba(0,0,0,0.6)] flex flex-col pointer-events-auto max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between mb-3 cursor-grab active:cursor-grabbing touch-none select-none">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="modal-circle-btn w-12 h-12 rounded-full bg-white dark:!bg-black shadow-[0_4px_14px_rgba(0,0,0,0.06)] dark:shadow-none border border-black/[0.03] dark:border-white/10 flex items-center justify-center hover:bg-zinc-50 dark:hover:!bg-zinc-900 active:scale-95 transition-all cursor-pointer flex-shrink-0 outline-none focus:outline-none"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-black dark:text-white" strokeWidth={2} />
                </button>
                <div className="w-12 h-12" />
              </div>

              <div className="flex items-center space-x-3 mb-3">
                <FileText className="w-6 h-6 text-[#1C1C1E] dark:text-white shrink-0" strokeWidth={2} />
                <h3 className="text-[24px] font-bold text-[#1C1C1E] dark:text-white tracking-tight">
                  Terms of Use
                </h3>
              </div>

              <div className="text-[14px] text-[#8E8E93] dark:text-[#98989D] space-y-3 leading-relaxed mb-6">
                <p>
                  <strong className="text-[#1C1C1E] dark:text-white">Informational Use Only:</strong> PetHealth Tracker AI provides preliminary symptom identification and routine wellness suggestions for general informational purposes only.
                </p>
                <p>
                  <strong className="text-[#1C1C1E] dark:text-white">Not Veterinary Advice:</strong> AI analysis and recommendations do NOT constitute veterinary clinical diagnosis, treatment plans, or emergency advice. In cases of sudden illness, acute injury, or distress, seek care from a licensed veterinary specialist immediately.
                </p>
                <p>
                  <strong className="text-[#1C1C1E] dark:text-white">Owner Care Responsibility:</strong> Users maintain ultimate responsibility for their pet’s nutrition, medical interventions, and well-being.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-full py-4 rounded-[50px] bg-black dark:bg-white text-white dark:text-black font-bold text-[16px] active:scale-[0.98] transition-all cursor-pointer"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Pet Onboarding Questions Modal */}
      <AddPetQuizModal
        isOpen={showAddPetQuiz}
        onClose={() => setShowAddPetQuiz(false)}
        onAddPet={handleAddNewPet}
        currentLanguage={currentLanguage === "en" ? "en" : "ru"}
      />
    </div>
  );
}
