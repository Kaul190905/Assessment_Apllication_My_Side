import React from 'react';
import {
    BookOpen,
    Target,
    CheckCircle,
    BarChart3,
    LayoutDashboard,
    User,
    Settings,
    LogOut,
    Calendar,
    Trophy,
    Star,
    Play,
    Check,
    Inbox,
    Clipboard,
    Sun,
    Moon,
    AlertCircle,
    Clock,
    ChevronRight,
    Search
} from 'lucide-react';

// Icon components using Lucide React for a professional look
// We maintain the same component names for backward compatibility
// Default strokeWidth is set to 1.5 for a premium feel

export const BookIcon = ({ size = 24, color = 'currentColor' }) => (
    <BookOpen size={size} color={color} strokeWidth={1.5} />
);

export const TargetIcon = ({ size = 24, color = 'currentColor' }) => (
    <Target size={size} color={color} strokeWidth={1.5} />
);

export const CheckCircleIcon = ({ size = 24, color = 'currentColor' }) => (
    <CheckCircle size={size} color={color} strokeWidth={1.5} />
);

export const ChartIcon = ({ size = 24, color = 'currentColor' }) => (
    <BarChart3 size={size} color={color} strokeWidth={1.5} />
);

export const HomeIcon = ({ size = 24, color = 'currentColor' }) => (
    <LayoutDashboard size={size} color={color} strokeWidth={1.5} />
);

export const UserIcon = ({ size = 24, color = 'currentColor' }) => (
    <User size={size} color={color} strokeWidth={1.5} />
);

export const SettingsIcon = ({ size = 24, color = 'currentColor' }) => (
    <Settings size={size} color={color} strokeWidth={1.5} />
);

export const LogoutIcon = ({ size = 24, color = 'currentColor' }) => (
    <LogOut size={size} color={color} strokeWidth={1.5} />
);

export const CalendarIcon = ({ size = 24, color = 'currentColor' }) => (
    <Calendar size={size} color={color} strokeWidth={1.5} />
);

export const TrophyIcon = ({ size = 24, color = 'currentColor' }) => (
    <Trophy size={size} color={color} strokeWidth={1.5} />
);

export const StarIcon = ({ size = 24, color = 'currentColor' }) => (
    <Star size={size} color={color} strokeWidth={1.5} />
);

export const PlayIcon = ({ size = 24, color = 'currentColor' }) => (
    <Play size={size} color={color} strokeWidth={1.5} />
);

export const CheckIcon = ({ size = 24, color = 'currentColor' }) => (
    <Check size={size} color={color} strokeWidth={1.5} />
);

export const InboxIcon = ({ size = 24, color = 'currentColor' }) => (
    <Inbox size={size} color={color} strokeWidth={1.5} />
);

export const ClipboardIcon = ({ size = 24, color = 'currentColor' }) => (
    <Clipboard size={size} color={color} strokeWidth={1.5} />
);

export const SunIcon = ({ size = 24, color = 'currentColor' }) => (
    <Sun size={size} color={color} strokeWidth={1.5} />
);

export const MoonIcon = ({ size = 24, color = 'currentColor' }) => (
    <Moon size={size} color={color} strokeWidth={1.5} />
);

export const AlertCircleIcon = ({ size = 24, color = 'currentColor' }) => (
    <AlertCircle size={size} color={color} strokeWidth={1.5} />
);

export const ClockIcon = ({ size = 24, color = 'currentColor' }) => (
    <Clock size={size} color={color} strokeWidth={1.5} />
);

export const ChevronRightIcon = ({ size = 24, color = 'currentColor' }) => (
    <ChevronRight size={size} color={color} strokeWidth={1.5} />
);

export const SearchIcon = ({ size = 24, color = 'currentColor' }) => (
    <Search size={size} color={color} strokeWidth={1.5} />
);

const icons = {
    BookIcon,
    TargetIcon,
    CheckCircleIcon,
    ChartIcon,
    HomeIcon,
    UserIcon,
    SettingsIcon,
    LogoutIcon,
    CalendarIcon,
    TrophyIcon,
    StarIcon,
    PlayIcon,
    CheckIcon,
    InboxIcon,
    ClipboardIcon,
    SunIcon,
    MoonIcon,
    AlertCircleIcon,
    ClockIcon,
    ChevronRightIcon,
    SearchIcon
};

export default icons;
