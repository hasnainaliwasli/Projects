// User Roles
export type UserRole = "student" | "owner" | "admin";

// Gender Types
export type GenderType = "boys" | "girls" | "mixed";

// Availability Status
export type AvailabilityStatus = "available" | "full" | "limited";

// User Interface
export interface User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    profileImage?: string;
    phoneNumbers?: string[];
    homeAddress?: string;
    favoriteHostels?: string[]; // For students
    createdAt: string;
}

export type loginCredentials = {
    email: string;
    password: string;
}

// Location Interface
export interface Location {
    city: string;
    area: string;
    address: string;
    latitude: number;
    longitude: number;
}

// Facilities Interface
export interface Facilities {
    fridge: boolean;
    water: boolean;
    electricity: boolean;
    wifi: boolean;
    laundry: boolean;
    parking: boolean;
    security: boolean;
    meals: boolean;
}

// Room Info Interface
export interface RoomInfo {
    type: string; // e.g., "Single", "Double", "Triple"
    capacity: number;
    rentPerRoom?: number;
    rentPerBed?: number;
}

// Hostel Interface
export interface Hostel {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    ownerName: string;
    genderType: GenderType;
    location: Location;
    images: string[];
    rooms: RoomInfo[];
    floors: number;
    roomsPerFloor?: number;
    rent: number;
    facilities: Facilities;
    availableBeds: number;
    availability: AvailabilityStatus;
    contactNumber: string[];
    isFor: "boys" | "girls";
    createdAt: string;
    updatedAt: string;
    rating: number;
    reviewIds: string[];
    isActive?: boolean; // For admin to block/unblock
    status?: 'pending' | 'approved' | 'rejected';
}

// Review Interface
export interface Review {
    id: string;
    hostelId: string;
    userId: string;
    userName: string;
    userImage?: string;
    rating: number; // 1-5
    comment: string;
    proof?: string; // Image URL or description
    createdAt: string;
}

// Auth State
export interface AuthState {
    isAuthenticated: boolean;
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

// Filters State
export interface HostelFilters {
    searchQuery: string;
    city: string;
    gender: GenderType | "all";
    minRent: number;
    maxRent: number;
    facilities: Partial<Facilities>;
    // Additional filters used in slice
    roomType?: string;
    minPrice?: number;
    maxPrice?: number;
    area?: string;
    isFor?: "boys" | "girls";
    availability?: AvailabilityStatus;
}
