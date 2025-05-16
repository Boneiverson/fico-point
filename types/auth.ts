export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
    profileImage?: string;
    gender?: "male" | "female";
    maritalStatus?: string;
    employmentStatus?: string;
    idDocument?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    phoneVerified: boolean;
    phoneNumber: string;
    session: any | null;
  }