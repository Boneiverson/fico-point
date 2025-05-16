import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthState } from "@/types/auth";
import { supabase } from "@/lib/supabase";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  setPhoneNumber: (phoneNumber: string) => void;
  setPhoneVerified: (verified: boolean) => void;
  resetVerificationState: () => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      phoneVerified: false,
      phoneNumber: "",
      session: null,

      setPhoneNumber: (phoneNumber) => {
        set({ phoneNumber });
      },

      setPhoneVerified: (verified) => {
        set({ phoneVerified: verified });
      },

      resetVerificationState: () => {
        set({ phoneVerified: false, phoneNumber: "" });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Attempting login with:", email);
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Login error:", error.message);
            throw error;
          }

          console.log("Login successful, user:", data.user?.id);
          
          if (data.user) {
            // Fetch user profile from database
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (userError) {
              console.log("User profile not found, creating one");
              // If user profile doesn't exist, create one with basic info
              const newUser: User = {
                id: data.user.id,
                firstName: data.user.user_metadata?.first_name || "User",
                lastName: data.user.user_metadata?.last_name || "",
                email: data.user.email || "",
                phoneNumber: data.user.phone || "",
              };

              // Create user profile
              await supabase.from('users').insert([{
                id: newUser.id,
                first_name: newUser.firstName,
                last_name: newUser.lastName,
                email: newUser.email,
                phone_number: newUser.phoneNumber,
              }]);
              
              set({ 
                user: newUser,
                isAuthenticated: true, 
                isLoading: false,
                session: data.session
              });
            } else {
              console.log("User profile found:", userData.id);
              // User profile exists, use it
              const user: User = {
                id: userData.id,
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                phoneNumber: userData.phone_number,
                profileImage: userData.profile_image,
                gender: userData.gender,
                maritalStatus: userData.marital_status,
                employmentStatus: userData.employment_status,
                idDocument: userData.id_document,
              };

              set({ 
                user,
                isAuthenticated: true, 
                isLoading: false,
                session: data.session
              });
            }
            
            // Store session in AsyncStorage
            await AsyncStorage.setItem('auth-session', JSON.stringify(data.session));
          }
        } catch (error: any) {
          console.error("Login failed:", error.message);
          set({ 
            error: error.message || "Login failed", 
            isLoading: false 
          });
        }
      },

      loginWithPhone: async (phoneNumber, password) => {
        set({ isLoading: true, error: null });
        try {
          // For development, we'll use email login with a phone-based email
          const email = `${phoneNumber.replace(/[^0-9]/g, '')}@phone.user`;
          
          console.log("Attempting phone login with email:", email);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Phone login error:", error.message);
            throw error;
          }

          console.log("Phone login successful, user:", data.user?.id);

          if (data.user) {
            // Fetch user profile
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (userError) {
              console.log("User profile not found, creating one");
              // Create basic user profile if it doesn't exist
              const newUser: User = {
                id: data.user.id,
                firstName: "Phone",
                lastName: "User",
                email: email,
                phoneNumber: phoneNumber,
              };

              await supabase.from('users').insert([{
                id: newUser.id,
                first_name: newUser.firstName,
                last_name: newUser.lastName,
                email: newUser.email,
                phone_number: newUser.phoneNumber,
              }]);
              
              set({ 
                user: newUser,
                isAuthenticated: true, 
                isLoading: false,
                session: data.session
              });
            } else {
              console.log("User profile found:", userData.id);
              // Use existing user profile
              const user: User = {
                id: userData.id,
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                phoneNumber: userData.phone_number,
                profileImage: userData.profile_image,
                gender: userData.gender,
                maritalStatus: userData.marital_status,
                employmentStatus: userData.employment_status,
                idDocument: userData.id_document,
              };

              set({ 
                user,
                isAuthenticated: true, 
                isLoading: false,
                session: data.session
              });
            }
            
            await AsyncStorage.setItem('auth-session', JSON.stringify(data.session));
          }
        } catch (error: any) {
          console.error("Phone login failed:", error.message);
          set({ 
            error: error.message || "Login failed", 
            isLoading: false 
          });
        }
      },

      register: async (userData, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Registering user:", userData.email);
          
          // Create auth user
          const { data, error } = await supabase.auth.signUp({
            email: userData.email || '',
            password,
            phone: userData.phoneNumber,
            options: {
              data: {
                first_name: userData.firstName,
                last_name: userData.lastName,
              },
            },
          });

          if (error) {
            console.error("Registration error:", error.message);
            throw error;
          }

          console.log("Registration successful, user:", data.user?.id);

          if (data.user) {
            // Create user profile in database
            const newUser: User = {
              id: data.user.id,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email,
              phoneNumber: userData.phoneNumber || '',
              gender: userData.gender,
              maritalStatus: userData.maritalStatus,
              employmentStatus: userData.employmentStatus,
              idDocument: userData.idDocument,
            };
            
            // Insert user into database
            const { error: insertError } = await supabase.from('users').insert([{
              id: newUser.id,
              first_name: newUser.firstName,
              last_name: newUser.lastName,
              email: newUser.email,
              phone_number: newUser.phoneNumber,
              gender: newUser.gender,
              marital_status: newUser.maritalStatus,
              employment_status: newUser.employmentStatus,
              id_document: newUser.idDocument,
            }]);
            
            if (insertError) {
              console.error("Error creating user profile:", insertError.message);
            }
            
            set({ 
              user: newUser,
              isAuthenticated: true, 
              isLoading: false,
              phoneVerified: false,
              phoneNumber: "",
              session: data.session
            });
            
            await AsyncStorage.setItem('auth-session', JSON.stringify(data.session));
          }
        } catch (error: any) {
          console.error("Registration failed:", error.message);
          set({ 
            error: error.message || "Registration failed", 
            isLoading: false 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          console.log("Logging out");
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          // Remove session from AsyncStorage
          await AsyncStorage.removeItem('auth-session');
          
          set({ 
            user: null, 
            isAuthenticated: false,
            phoneVerified: false,
            phoneNumber: "",
            session: null,
            isLoading: false
          });
        } catch (error: any) {
          console.error("Logout failed:", error.message);
          set({ 
            error: error.message || "Logout failed",
            isLoading: false
          });
        }
      },

      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user: currentUser } = get();
          if (!currentUser) throw new Error("User not authenticated");

          console.log("Updating user:", currentUser.id);

          // Update user in database
          const { error } = await supabase
            .from('users')
            .update({
              first_name: userData.firstName,
              last_name: userData.lastName,
              phone_number: userData.phoneNumber,
              gender: userData.gender,
              marital_status: userData.maritalStatus,
              employment_status: userData.employmentStatus,
              id_document: userData.idDocument,
              profile_image: userData.profileImage,
            })
            .eq('id', currentUser.id);

          if (error) throw error;

          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false
          }));
        } catch (error: any) {
          console.error("Update user failed:", error.message);
          set({ 
            error: error.message || "Failed to update user",
            isLoading: false
          });
        }
      },

      verifyOtp: async (otp) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would verify the OTP with your backend
          // For now, we'll simulate a successful verification
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isLoading: false, phoneVerified: true });
          return true;
        } catch (error: any) {
          console.error("OTP verification failed:", error.message);
          set({ 
            error: error.message || "Verification failed", 
            isLoading: false 
          });
          return false;
        }
      },

      refreshSession: async () => {
        set({ isLoading: true });
        try {
          console.log("Refreshing session");
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Session refresh error:", error.message);
            throw error;
          }
          
          console.log("Session refresh result:", data.session ? "Session found" : "No session");
          
          if (data.session) {
            // Fetch user profile
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.session.user.id)
              .single();

            if (userError) {
              console.log("User profile not found, creating one");
              // If user profile doesn't exist, create one with basic info
              const newUser: User = {
                id: data.session.user.id,
                firstName: data.session.user.user_metadata?.first_name || "User",
                lastName: data.session.user.user_metadata?.last_name || "",
                email: data.session.user.email || "",
                phoneNumber: data.session.user.phone || "",
              };

              // Create user profile
              await supabase.from('users').insert([{
                id: newUser.id,
                first_name: newUser.firstName,
                last_name: newUser.lastName,
                email: newUser.email,
                phone_number: newUser.phoneNumber,
              }]);
              
              set({ 
                user: newUser,
                isAuthenticated: true,
                session: data.session,
                isLoading: false
              });
            } else {
              console.log("User profile found:", userData.id);
              // User profile exists, use it
              const user: User = {
                id: userData.id,
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                phoneNumber: userData.phone_number,
                profileImage: userData.profile_image,
                gender: userData.gender,
                maritalStatus: userData.marital_status,
                employmentStatus: userData.employment_status,
                idDocument: userData.id_document,
              };

              set({ 
                user,
                isAuthenticated: true,
                session: data.session,
                isLoading: false
              });
            }
          } else {
            set({ 
              user: null,
              isAuthenticated: false,
              session: null,
              isLoading: false
            });
          }
        } catch (error: any) {
          console.error("Session refresh failed:", error.message);
          set({ 
            user: null,
            isAuthenticated: false,
            session: null,
            error: error.message || "Failed to refresh session",
            isLoading: false
          });
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        phoneVerified: state.phoneVerified,
        phoneNumber: state.phoneNumber,
      }),
    }
  )
);