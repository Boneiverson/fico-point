import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import Button from "@/components/Button";
import colors from "@/constants/Colors";
import { useLoanStore } from "@/store/loan-store";
import LoanCard from "@/components/LoanCard";

export default function LoanHistoryScreen() {
  const router = useRouter();
  const { loans, fetchLoans, isLoading } = useLoanStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

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

  const handleMakePayment = (loanId: string) => {
    router.push({
      pathname: "/loan-payment",
      params: { id: loanId },
    });
  };

  const handleApplyForLoan = () => {
    router.push("/loan-request");
  };

  const handleBack = () => {
    router.back();
  };

  // Filter loans based on the selected filter
  const filteredLoans = loans.filter((loan) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return loan.status === "active" || loan.status === "approved";
    if (activeFilter === "completed") return loan.status === "completed";
    return true;
  });

  // Sort loans by date (newest first)
  const sortedLoans = [...filteredLoans].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan History</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>Your Loans</Text>
          <Text style={styles.subtitle}>
            View all your loan transactions
          </Text>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "all" && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter("all")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "all" && styles.activeFilterText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "active" && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter("active")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "active" && styles.activeFilterText,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "completed" && styles.activeFilterTab,
              ]}
              onPress={() => setActiveFilter("completed")}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === "completed" && styles.activeFilterText,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading && !refreshing ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : sortedLoans.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You have no loan history yet.</Text>
              <Button
                title="Apply for a loan"
                onPress={handleApplyForLoan}
                variant="primary"
                style={styles.applyButton}
              />
            </View>
          ) : (
            sortedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onViewDetails={() => handleViewLoanDetails(loan.id)}
                onMakePayment={loan.status === "active" ? () => handleMakePayment(loan.id) : undefined}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerRight: {
    width: 32,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: colors.backgroundLight,
    borderRadius: 24,
    marginBottom: 24,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
  },
  activeFilterTab: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.text,
    fontWeight: "500",
  },
  emptyContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.divider,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginVertical: 24,
  },
  applyButton: {
    minWidth: 150,
  },
});