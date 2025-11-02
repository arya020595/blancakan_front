/**
 * Icons - Centralized icon components using Lucide React
 * 
 * Benefits:
 * - Consistent styling across the app
 * - Standardized colors and sizes
 * - Easy maintenance and updates
 * - Better developer experience with autocomplete
 * - Reduced code repetition
 */

import { cn } from "@/lib/utils";
import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronUp,
    Copy,
    Download,
    Edit,
    ExternalLink,
    Eye,
    EyeOff,
    Filter,
    Home,
    Info,
    LogOut,
    Menu,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Search,
    Settings,
    SortAsc,
    SortDesc,
    Trash2,
    Upload,
    User,
    Users,
    X,
} from "lucide-react";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Centralized icon components with consistent styling
 */
export const Icons = {
  // Alert & Status Icons
  warning: ({ className, size = 16 }: IconProps) => (
    <AlertTriangle className={cn("text-yellow-600", className)} size={size} />
  ),
  error: ({ className, size = 16 }: IconProps) => (
    <AlertCircle className={cn("text-red-600", className)} size={size} />
  ),
  info: ({ className, size = 16 }: IconProps) => (
    <Info className={cn("text-blue-600", className)} size={size} />
  ),
  success: ({ className, size = 16 }: IconProps) => (
    <Check className={cn("text-green-600", className)} size={size} />
  ),

  // Action Icons
  close: ({ className, size = 16 }: IconProps) => (
    <X className={cn("text-gray-500 hover:text-gray-700 transition-colors", className)} size={size} />
  ),
  edit: ({ className, size = 16 }: IconProps) => (
    <Edit className={cn("text-blue-600 hover:text-blue-700 transition-colors", className)} size={size} />
  ),
  delete: ({ className, size = 16 }: IconProps) => (
    <Trash2 className={cn("text-red-600 hover:text-red-700 transition-colors", className)} size={size} />
  ),
  add: ({ className, size = 16 }: IconProps) => (
    <Plus className={cn("text-green-600 hover:text-green-700 transition-colors", className)} size={size} />
  ),
  view: ({ className, size = 16 }: IconProps) => (
    <Eye className={cn("text-gray-600 hover:text-gray-700 transition-colors", className)} size={size} />
  ),
  hide: ({ className, size = 16 }: IconProps) => (
    <EyeOff className={cn("text-gray-600 hover:text-gray-700 transition-colors", className)} size={size} />
  ),
  copy: ({ className, size = 16 }: IconProps) => (
    <Copy className={cn("text-gray-600 hover:text-gray-700 transition-colors", className)} size={size} />
  ),
  external: ({ className, size = 16 }: IconProps) => (
    <ExternalLink className={cn("text-gray-600 hover:text-gray-700 transition-colors", className)} size={size} />
  ),

  // Navigation Icons
  search: ({ className, size = 16 }: IconProps) => (
    <Search className={cn("text-gray-400", className)} size={size} />
  ),
  menu: ({ className, size = 16 }: IconProps) => (
    <Menu className={cn("text-gray-600", className)} size={size} />
  ),
  home: ({ className, size = 16 }: IconProps) => (
    <Home className={cn("text-gray-600", className)} size={size} />
  ),
  logout: ({ className, size = 16 }: IconProps) => (
    <LogOut className={cn("text-gray-600", className)} size={size} />
  ),

  // Sort & Filter Icons
  sortAsc: ({ className, size = 16 }: IconProps) => (
    <ChevronUp className={cn("text-gray-600", className)} size={size} />
  ),
  sortDesc: ({ className, size = 16 }: IconProps) => (
    <ChevronDown className={cn("text-gray-600", className)} size={size} />
  ),
  sortNone: ({ className, size = 16 }: IconProps) => (
    <SortAsc className={cn("text-gray-300", className)} size={size} />
  ),
  filter: ({ className, size = 16 }: IconProps) => (
    <Filter className={cn("text-gray-600", className)} size={size} />
  ),

  // Pagination Icons
  chevronLeft: ({ className, size = 16 }: IconProps) => (
    <ChevronLeft className={cn("text-gray-600", className)} size={size} />
  ),
  chevronRight: ({ className, size = 16 }: IconProps) => (
    <ChevronRight className={cn("text-gray-600", className)} size={size} />
  ),
  chevronsLeft: ({ className, size = 16 }: IconProps) => (
    <ChevronsLeft className={cn("text-gray-600", className)} size={size} />
  ),
  chevronsRight: ({ className, size = 16 }: IconProps) => (
    <ChevronsRight className={cn("text-gray-600", className)} size={size} />
  ),

  // Data & Content Icons
  user: ({ className, size = 16 }: IconProps) => (
    <User className={cn("text-gray-600", className)} size={size} />
  ),
  users: ({ className, size = 16 }: IconProps) => (
    <Users className={cn("text-gray-600", className)} size={size} />
  ),
  calendar: ({ className, size = 16 }: IconProps) => (
    <Calendar className={cn("text-gray-600", className)} size={size} />
  ),
  settings: ({ className, size = 16 }: IconProps) => (
    <Settings className={cn("text-gray-600", className)} size={size} />
  ),

  // Utility Icons
  more: ({ className, size = 16 }: IconProps) => (
    <MoreHorizontal className={cn("text-gray-600", className)} size={size} />
  ),
  download: ({ className, size = 16 }: IconProps) => (
    <Download className={cn("text-gray-600 hover:text-gray-700 transition-colors", className)} size={size} />
  ),
  upload: ({ className, size = 16 }: IconProps) => (
    <Upload className={cn("text-gray-600 hover:text-gray-700 transition-colors", className)} size={size} />
  ),
  refresh: ({ className, size = 16 }: IconProps) => (
    <RefreshCw className={cn("text-gray-600 hover:text-gray-700 transition-colors", className)} size={size} />
  ),

  // Raw icons (for custom styling)
  raw: {
    AlertTriangle,
    AlertCircle,
    X,
    Edit,
    Trash2,
    Plus,
    Search,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Eye,
    EyeOff,
    Check,
    Info,
    Settings,
    User,
    Users,
    Calendar,
    Filter,
    SortAsc,
    SortDesc,
    MoreHorizontal,
    Download,
    Upload,
    RefreshCw,
    Copy,
    ExternalLink,
    Home,
    Menu,
    LogOut,
  },
};

export default Icons;