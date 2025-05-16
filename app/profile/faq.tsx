import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import Header from "@/components/Header";
import colors from "@/constants/Colors";

// FAQ data
const faqData = [
  {
    question: "How do I apply for a loan?",
    answer: "You can apply for a loan by clicking on the 'Request' button on the home screen. Fill in your personal details, add guarantors, and provide your account information. Once submitted, your application will be reviewed and you'll be notified of the decision."
  },
  {
    question: "What are the eligibility requirements?",
    answer: "To be eligible for a loan, you must be at least 18 years old, have a valid ID, provide proof of income, and have at least one guarantor. Your credit history and employment status will also be considered during the application review."
  },
  {
    question: "How long does the approval process take?",
    answer: "The loan approval process typically takes 24-48 hours. Once approved, funds will be disbursed to your mobile money account within the next business day."
  },
  {
    question: "What is the interest rate?",
    answer: "Our standard interest rate is 10% for the duration of the loan. This is a flat rate and does not compound. The total repayment amount is clearly shown before you confirm your loan application."
  },
  {
    question: "How do I repay my loan?",
    answer: "You can repay your loan through the app by selecting the 'Pay Now' option on your active loan. We accept payments through various mobile money providers including MTN Mobile Money, Vodafone Cash, and AirtelTigo Money."
  },
  {
    question: "What happens if I can't repay on time?",
    answer: "If you're unable to repay your loan by the due date, please contact our support team immediately. Late payments may incur additional fees and affect your ability to get loans in the future. We're committed to working with you to find a solution."
  },
  {
    question: "Can I pay off my loan early?",
    answer: "Yes, you can pay off your loan early without any prepayment penalties. Simply use the 'Pay Now' option and enter the full amount you wish to pay."
  },
  {
    question: "What do I need to provide as a guarantor?",
    answer: "A guarantor needs to provide their full name, phone number, email (optional), and their relationship to you. They may be contacted to verify their willingness to serve as your guarantor."
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take data security very seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent. Please refer to our Privacy Policy for more details."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team through the 'Contact Support' option in the Profile section of the app. Our support team is available Monday to Friday, 8am to 6pm."
  }
];

export default function FAQScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Frequently Asked Questions" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Find answers to common questions about FastLoan
          </Text>
          
          {faqData.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.faqItem,
                expandedIndex === index && styles.faqItemExpanded
              ]}
              onPress={() => toggleExpand(index)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.question}>{item.question}</Text>
                {expandedIndex === index ? (
                  <ChevronUp size={20} color={colors.primary} />
                ) : (
                  <ChevronDown size={20} color={colors.textSecondary} />
                )}
              </View>
              
              {expandedIndex === index && (
                <Text style={styles.answer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
          
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Still have questions?</Text>
            <Text style={styles.contactText}>
              If you couldn't find the answer to your question, please contact our support team.
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => router.push("/profile/support")}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
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
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  faqItemExpanded: {
    backgroundColor: colors.primaryLight,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    paddingRight: 16,
  },
  answer: {
    fontSize: 14,
    color: colors.text,
    marginTop: 12,
    lineHeight: 20,
  },
  contactSection: {
    marginTop: 24,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  contactButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});