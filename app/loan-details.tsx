import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  DollarSign,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  ChevronRight,
} from "lucide-react-native";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import colors from "@/constants/Colors";
import { useLoanStore } from "@/store/loan-store";
import { LoanRequest } from "@/types/loan";

export default function LoanDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { loans } = useLoanStore();
  
  const [loan, setLoan] = useState<LoanRequest | null>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      const foundLoan = loans.find((l) => l.id === id);
      if (foundLoan) {
        setLoan(foundLoan);
      }
    }
  }, [id, loans]);

  const handleMakePayment = () => {
    if (loan) {
      router.push({
        pathname: "/loan-payment",
        params: { id: loan.id }
      });
    }
  };

  if (!loan) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Loan Details" />
        <View style={styles.noLoanContainer}>
          <Text style={styles.noLoanText}>Loan not found.</Text>
          <Button
            title="Back to Home"
            onPress={() => router.replace("/(tabs)")}
            variant="primary"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDueDate = () => {
    const createdDate = new Date(loan.createdAt);
    const dueDate = new Date(
      createdDate.getTime() + loan.duration * 24 * 60 * 60 * 1000
    );
    return formatDate(dueDate.toISOString());
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Loan Details" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card variant="elevated" style={styles.loanSummaryCard}>
            <View style={styles.loanHeader}>
              <View>
                <Text style={styles.loanAmount}>
                  ${loan.amount.toLocaleString()}
                </Text>
                <Text style={styles.loanPurpose}>{loan.purpose}</Text>
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

            <View style={styles.loanInfoGrid}>
              <View style={styles.loanInfoItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.loanInfoLabel}>Created</Text>
                <Text style={styles.loanInfoValue}>
                  {formatDate(loan.createdAt)}
                </Text>
              </View>
              
              <View style={styles.loanInfoItem}>
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={styles.loanInfoLabel}>Due Date</Text>
                <Text style={styles.loanInfoValue}>{getDueDate()}</Text>
              </View>
              
              <View style={styles.loanInfoItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.loanInfoLabel}>Duration</Text>
                <Text style={styles.loanInfoValue}>{loan.duration} days</Text>
              </View>
              
              <View style={styles.loanInfoItem}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text style={styles.loanInfoLabel}>Interest</Text>
                <Text style={styles.loanInfoValue}>10%</Text>
              </View>
            </View>

            {loan.status === "active" && (
              <Button
                title="Make Payment"
                onPress={handleMakePayment}
                variant="primary"
                fullWidth
                style={styles.paymentButton}
              />
            )}
          </Card>

          <Card variant="outlined" style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Guarantor Information</Text>
            
            {loan.guarantors.map((guarantor, index) => (
              <View key={guarantor.id} style={styles.guarantorItem}>
                <Text style={styles.guarantorTitle}>Guarantor {index + 1}</Text>
                
                <View style={styles.guarantorInfoItem}>
                  <User size={16} color={colors.textSecondary} />
                  <Text style={styles.guarantorInfoText}>{guarantor.fullName}</Text>
                </View>
                
                <View style={styles.guarantorInfoItem}>
                  <Phone size={16} color={colors.textSecondary} />
                  <Text style={styles.guarantorInfoText}>
                    {guarantor.phoneNumber}
                  </Text>
                </View>
                
                {guarantor.email && (
                  <View style={styles.guarantorInfoItem}>
                    <Mail size={16} color={colors.textSecondary} />
                    <Text style={styles.guarantorInfoText}>{guarantor.email}</Text>
                  </View>
                )}
                
                <View style={styles.guarantorInfoItem}>
                  <User size={16} color={colors.textSecondary} />
                  <Text style={styles.guarantorInfoText}>
                    Relationship: {guarantor.relationship}
                  </Text>
                </View>
              </View>
            ))}
          </Card>

          <Card variant="outlined" style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Payment Information</Text>
            
            <View style={styles.paymentInfoItem}>
              <CreditCard size={16} color={colors.textSecondary} />
              <Text style={styles.paymentInfoText}>
                Mobile Money: {loan.accountDetails.mobileMoneyNumber}
              </Text>
            </View>
            
            <View style={styles.paymentInfoItem}>
              <User size={16} color={colors.textSecondary} />
              <Text style={styles.paymentInfoText}>
                Account Name: {loan.accountDetails.accountName}
              </Text>
            </View>
            
            <View style={styles.paymentInfoItem}>
              <CreditCard size={16} color={colors.textSecondary} />
              <Text style={styles.paymentInfoText}>
                Provider: {loan.accountDetails.provider}
              </Text>
            </View>
          </Card>

          <TouchableOpacity
            style={styles.repaymentScheduleButton}
            onPress={() => {
              // In a real app, this would navigate to a repayment schedule screen
              console.log("View repayment schedule");
            }}
          >
            <Text style={styles.repaymentScheduleText}>
              View Repayment Schedule
            </Text>
            <ChevronRight size={20} color={colors.primary} />
          </TouchableOpacity>
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
  content: {
    padding: 16,
  },
  loanSummaryCard: {
    marginBottom: 16,
  },
  loanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  loanAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  loanPurpose: {
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
  loanInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  loanInfoItem: {
    width: "50%",
    flexDirection: "column",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  loanInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  loanInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  paymentButton: {
    marginTop: 8,
  },
  detailsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  guarantorItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  guarantorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  guarantorInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  guarantorInfoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  paymentInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentInfoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  repaymentScheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  repaymentScheduleText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
  },
  noLoanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  noLoanText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    minWidth: 150,
  },
});