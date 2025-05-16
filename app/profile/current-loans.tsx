import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import LoanCard from "@/components/LoanCard";
import EmptyState from "@/components/EmptyState";
import colors from "@/constants/Colors";
import { useLoanStore } from "@/store/loan-store";
import { CreditCard } from "lucide-react-native";
import { LoanRequest } from "@/types/loan";

export default function CurrentLoansScreen() {
  const router = useRouter();
  const { loans, fetchLoans, isLoading } = useLoanStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLoans();
    setRefreshing(false);
  };

  const handleViewLoanDetails = (loanId: string) => {
    router.push({
      pathname: "/loan-details",
      params: { id: loanId },
    });
  };

  const handleMakePayment = () => {
    router.push("/loan-payment");
  };

  const activeLoans = loans.filter((loan: { status: string; }) => loan.status === "active" || loan.status === "approved");

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Current Loans" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            View and manage your active loans
          </Text>

          {isLoading && !refreshing ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : activeLoans.length === 0 ? (
            <EmptyState
              title="No active loans"
              description="You don't have any active loans at the moment."
              icon={<CreditCard size={40} color={colors.textSecondary} />}
              actionLabel="Apply for a Loan"
              onAction={() => router.push("/loan-request")}
            />
          ) : (
            activeLoans.map((loan: LoanRequest) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onViewDetails={() => handleViewLoanDetails(loan.id)}
                onMakePayment={handleMakePayment}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 24,
    color: colors.textSecondary,
  },
});