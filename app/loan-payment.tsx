import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { DollarSign, Calendar, CreditCard, CheckCircle } from "lucide-react-native";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Button from "@/components/Button";
import SelectInput from "@/components/SelectInput";
import colors from "@/constants/Colors";
import { useLoanStore } from "@/store/loan-store";
import { LoanRequest } from "@/types/loan";

// Mock data for providers
const mobileMoneyProviders = [
  { label: "MTN Mobile Money", value: "mtn" },
  { label: "Vodafone Cash", value: "vodafone" },
  { label: "AirtelTigo Money", value: "airteltigo" },
];

// Mock provider logos
const providerLogos = {
  mtn: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New_MTN_Logo.svg/512px-New_MTN_Logo.svg.png",
  vodafone: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Vodafone_icon.svg/512px-Vodafone_icon.svg.png",
  airteltigo: "https://play-lh.googleusercontent.com/Qv-aFkzBJJwYbYDxX7NwD9rAJZwYcEI8BLAoHBCGMmBaKpvEQYl9qYBHiIdgzKTGJg=w240-h480-rw"
};

export default function LoanPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const loanId = params.id as string;
  
  const { loans, makePayment, isLoading } = useLoanStore();
  
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; provider?: string }>({});
  const [currentLoan, setCurrentLoan] = useState<LoanRequest | null>(null);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success
  
  useEffect(() => {
    if (loanId) {
      const loan = loans.find(l => l.id === loanId);
      if (loan) {
        setCurrentLoan(loan);
        // Pre-fill amount with the full loan amount
        setAmount(loan.amount.toString());
      }
    } else if (loans.length > 0) {
      // If no specific loan ID, use the first active loan
      const activeLoan = loans.find(loan => loan.status === "active");
      if (activeLoan) {
        setCurrentLoan(activeLoan);
        setAmount(activeLoan.amount.toString());
      }
    }
  }, [loanId, loans]);

  const validateForm = () => {
    const newErrors: { amount?: string; provider?: string } = {};
    
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (currentLoan && Number(amount) > currentLoan.amount) {
      newErrors.amount = "Amount cannot exceed the loan balance";
    }
    
    if (!provider) {
      newErrors.provider = "Provider is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setPaymentStep(2); // Move to confirmation step
    }
  };

  const handleConfirmPayment = async () => {
    if (currentLoan) {
      try {
        await makePayment(currentLoan.id, Number(amount), provider);
        setPaymentStep(3); // Move to success step
      } catch (error) {
        console.error("Payment error:", error);
        Alert.alert("Error", "Failed to process payment. Please try again.");
      }
    }
  };

  const handleFinish = () => {
    router.replace("/(tabs)");
  };

  const handleBack = () => {
    if (paymentStep > 1) {
      setPaymentStep(paymentStep - 1);
    } else {
      router.back();
    }
  };

  if (!currentLoan) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Make Payment" />
        <View style={styles.noLoanContainer}>
          <Text style={styles.noLoanText}>You don't have any active loans to pay.</Text>
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

  const renderPaymentForm = () => (
    <>
      <Card variant="elevated" style={styles.loanCard}>
        <Text style={styles.loanCardTitle}>Current Loan</Text>
        
        <View style={styles.loanInfoRow}>
          <View style={styles.loanInfoItem}>
            <View style={styles.loanInfoIconContainer}>
              <DollarSign size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.loanInfoLabel}>Amount</Text>
              <Text style={styles.loanInfoValue}>
                ${currentLoan.amount.toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.loanInfoItem}>
            <View style={styles.loanInfoIconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.loanInfoLabel}>Due Date</Text>
              <Text style={styles.loanInfoValue}>
                {new Date(
                  new Date(currentLoan.createdAt).getTime() +
                    currentLoan.duration * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card variant="outlined" style={styles.paymentCard}>
        <Text style={styles.paymentCardTitle}>Payment Details</Text>
        
        <Input
          label="Amount to Pay"
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          error={errors.amount}
          leftIcon={<DollarSign size={20} color={colors.textSecondary} />}
        />
        
        <SelectInput
          label="Payment Method"
          placeholder="Select mobile money provider"
          options={mobileMoneyProviders}
          value={provider}
          onChange={setProvider}
          error={errors.provider}
        />
        
        <View style={styles.paymentSummary}>
          <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
          
          <View style={styles.paymentSummaryRow}>
            <Text style={styles.paymentSummaryLabel}>Payment Amount:</Text>
            <Text style={styles.paymentSummaryValue}>
              ${amount ? Number(amount).toLocaleString() : "0"}
            </Text>
          </View>
          
          <View style={styles.paymentSummaryRow}>
            <Text style={styles.paymentSummaryLabel}>Transaction Fee:</Text>
            <Text style={styles.paymentSummaryValue}>$0.00</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.paymentSummaryRow}>
            <Text style={styles.paymentSummaryTotal}>Total:</Text>
            <Text style={styles.paymentSummaryTotalValue}>
              ${amount ? Number(amount).toLocaleString() : "0"}
            </Text>
          </View>
        </View>
        
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          fullWidth
          style={styles.payButton}
          icon={<CreditCard size={20} color={colors.white} />}
        />
      </Card>
    </>
  );

  const renderConfirmation = () => (
    <Card variant="elevated" style={styles.confirmationCard}>
      <Text style={styles.confirmationTitle}>Confirm Payment</Text>
      
      {provider && (
        <View style={styles.providerContainer}>
          <Image 
            source={{ uri: providerLogos[provider as keyof typeof providerLogos] }} 
            style={styles.providerLogo} 
          />
          <Text style={styles.providerName}>
            {mobileMoneyProviders.find(p => p.value === provider)?.label}
          </Text>
        </View>
      )}
      
      <View style={styles.confirmationDetails}>
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Loan ID:</Text>
          <Text style={styles.confirmationValue}>{currentLoan.id}</Text>
        </View>
        
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Amount:</Text>
          <Text style={styles.confirmationValue}>${Number(amount).toLocaleString()}</Text>
        </View>
        
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Payment Method:</Text>
          <Text style={styles.confirmationValue}>
            {mobileMoneyProviders.find(p => p.value === provider)?.label}
          </Text>
        </View>
        
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Date:</Text>
          <Text style={styles.confirmationValue}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>
      
      <Text style={styles.confirmationNote}>
        By confirming this payment, you agree to the terms and conditions of FastLoan.
      </Text>
      
      <View style={styles.confirmationButtons}>
        <Button
          title="Back"
          onPress={handleBack}
          variant="outline"
          style={styles.confirmBackButton}
        />
        <Button
          title="Confirm Payment"
          onPress={handleConfirmPayment}
          variant="primary"
          loading={isLoading}
          style={styles.confirmPayButton}
        />
      </View>
    </Card>
  );

  const renderSuccess = () => (
    <Card variant="elevated" style={styles.successCard}>
      <View style={styles.successIconContainer}>
        <CheckCircle size={60} color={colors.success} />
      </View>
      
      <Text style={styles.successTitle}>Payment Successful!</Text>
      <Text style={styles.successMessage}>
        Your payment of ${Number(amount).toLocaleString()} has been processed successfully.
      </Text>
      
      <View style={styles.successDetails}>
        <View style={styles.successRow}>
          <Text style={styles.successLabel}>Transaction ID:</Text>
          <Text style={styles.successValue}>TXN-{Date.now().toString().slice(-8)}</Text>
        </View>
        
        <View style={styles.successRow}>
          <Text style={styles.successLabel}>Date & Time:</Text>
          <Text style={styles.successValue}>{new Date().toLocaleString()}</Text>
        </View>
        
        <View style={styles.successRow}>
          <Text style={styles.successLabel}>Payment Method:</Text>
          <Text style={styles.successValue}>
            {mobileMoneyProviders.find(p => p.value === provider)?.label}
          </Text>
        </View>
      </View>
      
      <Button
        title="Back to Home"
        onPress={handleFinish}
        variant="primary"
        fullWidth
        style={styles.finishButton}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={
          paymentStep === 1 
            ? "Make Payment" 
            : paymentStep === 2 
              ? "Confirm Payment" 
              : "Payment Success"
        } 
        showBackButton={paymentStep !== 3}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {paymentStep === 1 && renderPaymentForm()}
          {paymentStep === 2 && renderConfirmation()}
          {paymentStep === 3 && renderSuccess()}
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
  loanCard: {
    marginBottom: 16,
  },
  loanCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  loanInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loanInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  loanInfoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  loanInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  loanInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  paymentCard: {
    marginBottom: 16,
  },
  paymentCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  paymentSummary: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  paymentSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  paymentSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentSummaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paymentSummaryValue: {
    fontSize: 14,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 8,
  },
  paymentSummaryTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  paymentSummaryTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  payButton: {
    marginTop: 8,
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
  // Confirmation styles
  confirmationCard: {
    padding: 20,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  providerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  providerLogo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  confirmationDetails: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  confirmationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  confirmationValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  confirmationNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmBackButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmPayButton: {
    flex: 1,
    marginLeft: 8,
  },
  // Success styles
  successCard: {
    padding: 20,
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.success,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  successDetails: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: "100%",
  },
  successRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  successLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  successValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  finishButton: {
    marginTop: 8,
    width: "100%",
  },
});