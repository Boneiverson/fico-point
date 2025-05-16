import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, ArrowRight, History } from "lucide-react-native";
import Card from "@/components/Card";
import Button from "@/components/Button";
import EmptyState from "@/components/EmptyState";
import colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";
import { useLoanStore } from "@/store/loan-store";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { loans, fetchLoans, isLoading } = useLoanStore();
  
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    console.log("Fetching loans on home screen mount");
    fetchLoans();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchLoans();
    setRefreshing(false);
  }, []);

  const handleRequestLoan = () => {
    router.push("/loan-request");
  };

  const handlePayLoan = (loanId: string) => {
    router.push({
      pathname: "/loan-payment",
      params: { id: loanId }
    });
  };

  const handleViewAllHistory = () => {
    router.push("/profile/loan-history");
  };

  const handleViewLoanDetails = (loanId: string) => {
    router.push({
      pathname: "/loan-details",
      params: { id: loanId },
    });
  };

  // Get only active loans
  const activeLoans = loans.filter((loan) => loan.status === "active");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome {user?.firstName},</Text>
            <Text style={styles.subtitle}>Grow with a loan today.</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Only show loan status card if there are active loans */}
        {activeLoans.length > 0 ? (
          <Card
            variant="elevated"
            style={StyleSheet.flatten([styles.loanStatusCard, styles.activeLoansCard])}
          >
            <Text style={styles.activeLoansTitle}>Active Loan</Text>
            <View style={styles.activeLoanDetails}>
              <View>
                <Text style={styles.activeLoanAmount}>
                  ₵{activeLoans[0].amount.toLocaleString()}
                </Text>
                <Text style={styles.activeLoanDueDate}>
                  Due in {activeLoans[0].duration} days
                </Text>
              </View>
              <Button
                title="Pay Now"
                onPress={() => handlePayLoan(activeLoans[0].id)}
                variant="primary"
                size="small"
              />
            </View>
          </Card>
        ) : (
          <Card
            variant="elevated"
            style={StyleSheet.flatten([styles.loanStatusCard, styles.activeLoansCard])}
            >
            <View>
              <Text style={styles.noActiveLoansTitle}>No Active Loans</Text>
              <Text style={styles.noActiveLoansSubtitle}>
                You currently have no unpaid loans.
              </Text>
              <Button
                title="Apply for a Loan"
                onPress={handleRequestLoan}
                variant="primary"
                size="small"
                style={styles.applyButton}
                icon={<ArrowRight size={16} color={colors.white} />}
                iconPosition="right"
              />
            </View>
          </Card>
        )}

        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>Take a loan</Text>
          <Text style={styles.sectionSubtitle}>
            Request for a quick loan and get it into your bank account.
          </Text>
          <Button
            title="Request"
            onPress={handleRequestLoan}
            variant="primary"
            fullWidth
            icon={<ArrowRight size={20} color={colors.white} />}
            iconPosition="right"
          />
        </View>

        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Loan History</Text>
            {loans.length > 0 && (
              <TouchableOpacity onPress={handleViewAllHistory}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : loans.length === 0 ? (
            <EmptyState
              title="No loan history available yet."
              description="Apply for your first loan to get started."
              icon={<History size={40} color={colors.textSecondary} />}
              actionLabel="Apply for your first loan"
              onAction={handleRequestLoan}
            />
          ) : (
            loans.slice(0, 2).map((loan) => (
              <Card key={loan.id} variant="elevated" style={styles.loanHistoryCard}>
                <View style={styles.loanHistoryHeader}>
                  <View>
                    <Text style={styles.loanHistoryAmount}>
                      ₵{loan.amount.toLocaleString()}
                    </Text>
                    <Text style={styles.loanHistoryPurpose}>{loan.purpose}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(loan.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(loan.status) },
                      ]}
                    >
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.loanHistoryFooter}>
                  <Button
                    title="View Details"
                    variant="outline"
                    size="small"
                    onPress={() => handleViewLoanDetails(loan.id)}
                  />
                  {loan.status === "active" && (
                    <Button
                      title="Pay Now"
                      variant="primary"
                      size="small"
                      onPress={() => handlePayLoan(loan.id)}
                      style={styles.payNowButton}
                    />
                  )}
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return colors.success;
    case "rejected":
      return colors.error;
    case "pending":
      return colors.warning;
    case "active":
      return colors.primary;
    case "completed":
      return colors.success;
    default:
      return colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loanStatusCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  noActiveLoansCard: {
    backgroundColor: colors.primaryLight,
  },
  activeLoansCard: {
    backgroundColor: colors.primary,
  },
  noActiveLoansTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  noActiveLoansSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  applyButton: {
    alignSelf: "flex-start",
  },
  activeLoansTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 8,
  },
  activeLoanDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeLoanAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  activeLoanDueDate: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
  },
  actionSection: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  historySection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  loadingText: {
    textAlign: "center",
    marginVertical: 24,
    color: colors.textSecondary,
  },
  loanHistoryCard: {
    marginBottom: 12,
    padding: 16,
  },
  loanHistoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  loanHistoryAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  loanHistoryPurpose: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loanHistoryFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  payNowButton: {
    marginLeft: 8,
  },
});