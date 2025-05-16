import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoanRequest, LoanPayment, Guarantor, AccountDetails } from "@/types/loan";
import { useAuthStore } from "./auth-store";
import { supabase } from "@/lib/supabase";

interface LoanState {
  loans: LoanRequest[];
  payments: LoanPayment[];
  currentLoanRequest: Partial<LoanRequest> | null;
  isLoading: boolean;
  error: string | null;
}

interface LoanStore extends LoanState {
  fetchLoans: () => Promise<void>;
  fetchPayments: (loanId?: string) => Promise<void>;
  createLoanRequest: (loanData: Partial<LoanRequest>) => Promise<void>;
  updateLoanRequest: (loanId: string, loanData: Partial<LoanRequest>) => Promise<void>;
  makePayment: (loanId: string, amount: number, provider: string) => Promise<void>;
  setCurrentLoanRequest: (loanRequest: Partial<LoanRequest> | null) => void;
  updateCurrentLoanRequest: (data: Partial<LoanRequest>) => void;
  addGuarantor: (guarantor: Guarantor) => void;
  removeGuarantor: (guarantorId: string) => void;
  setAccountDetails: (accountDetails: AccountDetails) => void;
  resetLoanRequest: () => void;
}

export const useLoanStore = create<LoanStore>()(
  persist(
    (set, get) => ({
      loans: [],
      payments: [],
      currentLoanRequest: null,
      isLoading: false,
      error: null,

      fetchLoans: async () => {
        set({ isLoading: true, error: null });
        try {
          const userId = useAuthStore.getState().user?.id;
          
          if (!userId) {
            throw new Error("User not authenticated");
          }
          
          console.log("Fetching loans for user:", userId);
          
          // Fetch loans from Supabase
          const { data, error } = await supabase
            .from('loans')
            .select(`
              *,
              guarantors (*),
              account_details (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error("Error fetching loans:", error.message);
            throw error;
          }
          
          console.log("Loans fetched:", data ? data.length : 0);
          
          // Transform data to match our app's structure
          const loans: LoanRequest[] = data.map((loan: any) => ({
            id: loan.id,
            userId: loan.user_id,
            amount: loan.amount,
            purpose: loan.purpose,
            duration: loan.duration,
            guarantors: loan.guarantors.map((g: any) => ({
              id: g.id,
              fullName: g.full_name,
              phoneNumber: g.phone_number,
              email: g.email,
              relationship: g.relationship
            })),
            accountDetails: loan.account_details.length > 0 ? {
              id: loan.account_details[0].id,
              mobileMoneyNumber: loan.account_details[0].mobile_money_number,
              accountName: loan.account_details[0].account_name,
              provider: loan.account_details[0].provider
            } : {
              mobileMoneyNumber: "",
              accountName: "",
              provider: ""
            },
            status: loan.status,
            createdAt: loan.created_at,
            approvedAt: loan.approved_at,
            dueDate: loan.due_date
          }));
          
          set({ loans, isLoading: false });
        } catch (error: any) {
          console.error("Failed to fetch loans:", error.message);
          set({ 
            error: error.message || "Failed to fetch loans", 
            isLoading: false 
          });
        }
      },

      fetchPayments: async (loanId) => {
        set({ isLoading: true, error: null });
        try {
          const userId = useAuthStore.getState().user?.id;
          
          if (!userId) {
            throw new Error("User not authenticated");
          }
          
          let query = supabase
            .from('payments')
            .select(`
              *,
              loans!inner (user_id)
            `)
            .eq('loans.user_id', userId);
          
          if (loanId) {
            query = query.eq('loan_id', loanId);
          }
          
          const { data, error } = await query.order('date', { ascending: false });
          
          if (error) throw error;
          
          // Transform data to match our app's structure
          const payments: LoanPayment[] = data.map((payment: any) => ({
            id: payment.id,
            loanId: payment.loan_id,
            amount: payment.amount,
            date: payment.date,
            provider: payment.provider,
            transactionId: payment.transaction_id
          }));
          
          set({ payments, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to fetch payments", 
            isLoading: false 
          });
        }
      },

      createLoanRequest: async (loanData) => {
        set({ isLoading: true, error: null });
        try {
          const userId = useAuthStore.getState().user?.id;
          
          if (!userId) {
            throw new Error("User not authenticated");
          }
          
          console.log("Creating loan request for user:", userId, "with data:", JSON.stringify(loanData));
          
          // 1. Create the loan record
          const { data: loanResult, error: loanError } = await supabase
            .from('loans')
            .insert([{
              user_id: userId,
              amount: loanData.amount || 0,
              purpose: loanData.purpose || "",
              duration: loanData.duration || 30,
              status: "pending", // Set to pending for admin approval
              created_at: new Date().toISOString(),
              due_date: new Date(Date.now() + (loanData.duration || 30) * 24 * 60 * 60 * 1000).toISOString()
            }])
            .select();
          
          if (loanError) {
            console.error("Error creating loan:", loanError.message);
            throw loanError;
          }
          
          if (!loanResult || loanResult.length === 0) {
            throw new Error("Failed to create loan record");
          }
          
          const loanId = loanResult[0].id;
          console.log("Loan created with ID:", loanId);
          
          // 2. Create guarantors
          if (loanData.guarantors && loanData.guarantors.length > 0) {
            console.log("Adding guarantors:", loanData.guarantors.length);
            const guarantorsData = loanData.guarantors.map((g: Guarantor) => ({
              loan_id: loanId,
              full_name: g.fullName,
              phone_number: g.phoneNumber,
              email: g.email || null,
              relationship: g.relationship
            }));
            
            const { error: guarantorsError } = await supabase
              .from('guarantors')
              .insert(guarantorsData);
            
            if (guarantorsError) {
              console.error("Error adding guarantors:", guarantorsError.message);
              throw guarantorsError;
            }
          }
          
          // 3. Create account details
          if (loanData.accountDetails) {
            console.log("Adding account details");
            const { error: accountError } = await supabase
              .from('account_details')
              .insert([{
                loan_id: loanId,
                mobile_money_number: loanData.accountDetails.mobileMoneyNumber,
                account_name: loanData.accountDetails.accountName,
                provider: loanData.accountDetails.provider
              }]);
            
            if (accountError) {
              console.error("Error adding account details:", accountError.message);
              throw accountError;
            }
          }
          
          // 4. Fetch the newly created loan with all related data
          console.log("Refreshing loans after creation");
          await get().fetchLoans();
          
          // 5. Reset current loan request
          set({ currentLoanRequest: null, isLoading: false });
          console.log("Loan request created successfully");
        } catch (error: any) {
          console.error("Failed to create loan request:", error.message);
          set({ 
            error: error.message || "Failed to create loan request", 
            isLoading: false 
          });
        }
      },

      updateLoanRequest: async (loanId, loanData) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Update the loan record
          const updateData: any = {};
          
          if (loanData.amount !== undefined) updateData.amount = loanData.amount;
          if (loanData.purpose !== undefined) updateData.purpose = loanData.purpose;
          if (loanData.duration !== undefined) updateData.duration = loanData.duration;
          if (loanData.status !== undefined) updateData.status = loanData.status;
          
          if (Object.keys(updateData).length > 0) {
            const { error: loanError } = await supabase
              .from('loans')
              .update(updateData)
              .eq('id', loanId);
            
            if (loanError) throw loanError;
          }
          
          // 2. Update account details if provided
          if (loanData.accountDetails) {
            const { error: accountError } = await supabase
              .from('account_details')
              .update({
                mobile_money_number: loanData.accountDetails.mobileMoneyNumber,
                account_name: loanData.accountDetails.accountName,
                provider: loanData.accountDetails.provider
              })
              .eq('loan_id', loanId);
            
            if (accountError) throw accountError;
          }
          
          // 3. Fetch updated loans
          await get().fetchLoans();
          
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to update loan request", 
            isLoading: false 
          });
        }
      },

      makePayment: async (loanId, amount, provider) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Create payment record
          const transactionId = `txn-${Math.floor(Math.random() * 1000000)}`;
          
          const { error: paymentError } = await supabase
            .from('payments')
            .insert([{
              loan_id: loanId,
              amount,
              date: new Date().toISOString(),
              provider,
              transaction_id: transactionId
            }]);
          
          if (paymentError) throw paymentError;
          
          // 2. Get the loan to check if it's fully paid
          const { data: loanData, error: loanFetchError } = await supabase
            .from('loans')
            .select('amount, status')
            .eq('id', loanId)
            .single();
          
          if (loanFetchError) throw loanFetchError;
          
          // 3. Check if payment amount equals or exceeds loan amount
          if (amount >= loanData.amount && loanData.status === 'active') {
            const { error: updateError } = await supabase
              .from('loans')
              .update({ status: 'completed' })
              .eq('id', loanId);
            
            if (updateError) throw updateError;
          }
          
          // 4. Fetch updated data
          await get().fetchLoans();
          await get().fetchPayments(loanId);
          
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to make payment", 
            isLoading: false 
          });
        }
      },

      setCurrentLoanRequest: (loanRequest) => {
        set({ currentLoanRequest: loanRequest });
      },

      updateCurrentLoanRequest: (data) => {
        set(state => ({
          currentLoanRequest: state.currentLoanRequest 
            ? { ...state.currentLoanRequest, ...data } 
            : data
        }));
      },

      addGuarantor: (guarantor) => {
        set(state => {
          const currentGuarantors = state.currentLoanRequest?.guarantors || [];
          return {
            currentLoanRequest: {
              ...state.currentLoanRequest,
              guarantors: [...currentGuarantors, guarantor]
            }
          };
        });
      },

      removeGuarantor: (guarantorId) => {
        set(state => {
          const currentGuarantors = state.currentLoanRequest?.guarantors || [];
          return {
            currentLoanRequest: {
              ...state.currentLoanRequest,
              guarantors: currentGuarantors.filter(g => g.id !== guarantorId)
            }
          };
        });
      },

      setAccountDetails: (accountDetails) => {
        set(state => ({
          currentLoanRequest: {
            ...state.currentLoanRequest,
            accountDetails
          }
        }));
      },

      resetLoanRequest: () => {
        set({ currentLoanRequest: null });
      }
    }),
    {
      name: "loan-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentLoanRequest: state.currentLoanRequest
      }),
    }
  )
);