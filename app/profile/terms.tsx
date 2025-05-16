import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Header from "@/components/Header";
import colors from "@/constants/Colors";

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Terms of Service" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.lastUpdated}>Last Updated: June 1, 2023</Text>
          
          <Text style={styles.paragraph}>
            Welcome to FastLoan. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the FastLoan application, you agree to comply with and be bound by these Terms.
          </Text>
          
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By creating an account, accessing, or using the FastLoan application, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the FastLoan application.
          </Text>
          
          <Text style={styles.sectionTitle}>2. Eligibility</Text>
          <Text style={styles.paragraph}>
            You must be at least 18 years old and able to form legally binding contracts to use FastLoan. By using FastLoan, you represent and warrant that you meet all eligibility requirements.
          </Text>
          
          <Text style={styles.sectionTitle}>3. Account Registration</Text>
          <Text style={styles.paragraph}>
            To use FastLoan, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </Text>
          <Text style={styles.paragraph}>
            You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </Text>
          
          <Text style={styles.sectionTitle}>4. Loan Terms</Text>
          <Text style={styles.paragraph}>
            4.1. Loan Application: When you apply for a loan through FastLoan, you agree to provide accurate and complete information. We reserve the right to verify the information you provide and to reject any loan application at our discretion.
          </Text>
          <Text style={styles.paragraph}>
            4.2. Loan Approval: Loan approval is subject to our credit assessment and verification procedures. We may approve or reject your loan application based on various factors, including but not limited to your credit history, income, and existing financial obligations.
          </Text>
          <Text style={styles.paragraph}>
            4.3. Interest and Fees: The interest rate and any applicable fees will be clearly disclosed to you before you accept a loan. By accepting a loan, you agree to pay the principal amount, interest, and any applicable fees as specified in your loan agreement.
          </Text>
          <Text style={styles.paragraph}>
            4.4. Repayment: You agree to repay your loan according to the repayment schedule provided to you. Failure to make timely payments may result in additional fees, negative credit reporting, and legal action.
          </Text>
          
          <Text style={styles.sectionTitle}>5. Guarantors</Text>
          <Text style={styles.paragraph}>
            5.1. When you add a guarantor to your loan application, you represent that you have obtained their consent to act as your guarantor.
          </Text>
          <Text style={styles.paragraph}>
            5.2. Guarantors may be contacted to verify their willingness to serve as your guarantor and may be held liable for the loan amount if you fail to repay.
          </Text>
          
          <Text style={styles.sectionTitle}>6. Privacy</Text>
          <Text style={styles.paragraph}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using FastLoan, you consent to our collection and use of your personal information as described in our Privacy Policy.
          </Text>
          
          <Text style={styles.sectionTitle}>7. Prohibited Activities</Text>
          <Text style={styles.paragraph}>
            You agree not to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide false or misleading information</Text>
          <Text style={styles.bulletPoint}>• Use FastLoan for any illegal purpose</Text>
          <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to FastLoan or its related systems</Text>
          <Text style={styles.bulletPoint}>• Use FastLoan in any manner that could damage, disable, overburden, or impair it</Text>
          <Text style={styles.bulletPoint}>• Use any robot, spider, or other automated device to access FastLoan</Text>
          
          <Text style={styles.sectionTitle}>8. Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to terminate or suspend your account and access to FastLoan at any time for any reason, including but not limited to violation of these Terms. Upon termination, your right to use FastLoan will immediately cease.
          </Text>
          
          <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may modify these Terms at any time. If we make material changes, we will notify you through the FastLoan application or by other means. Your continued use of FastLoan after such notification constitutes your acceptance of the modified Terms.
          </Text>
          
          <Text style={styles.sectionTitle}>10. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws of Ghana, without regard to its conflict of law provisions.
          </Text>
          
          <Text style={styles.sectionTitle}>11. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: legal@fastloan.com</Text>
          <Text style={styles.contactInfo}>Phone: +233 30 123 4567</Text>
          <Text style={styles.contactInfo}>Address: 123 Independence Avenue, Accra, Ghana</Text>
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
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: "italic",
  },
  paragraph: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    marginLeft: 16,
    lineHeight: 20,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    marginLeft: 16,
  },
});