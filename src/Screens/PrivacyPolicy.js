import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking ,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const PrivacyPolicy = () => {


     const openEmail = () => {
    Linking.openURL('mailto:alrafay182@gmail.com');
  };

  const openLinkedIn = () => {
    Linking.openURL('https://www.linkedin.com/in/abdul-rafay-768906220/');
  };

  return (
    
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>Last Updated: [20-3-2024]</Text>

      <Text style={styles.paragraph}>
        Thank you for using our finance management and goal tracking mobile application ("App"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our App. Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the App.
      </Text>

      <Text style={styles.sectionTitle}>Collection of Your Information</Text>

      <Text style={styles.paragraph}>
        We may collect information about you in various ways when you use our App. The information we may collect includes:
      </Text>

      <Text style={styles.listItem}>- Personal Information: We may collect personal information that you voluntarily provide to us when you register for the App, such as your name, email address, and other contact information.</Text>
      <Text style={styles.listItem}>- Financial Information: We may collect information related to your income, expenses, savings, and financial goals that you input into the App for the purpose of managing your finances and tracking your goals.</Text>
      <Text style={styles.listItem}>- Usage Data: We may automatically collect certain information about your device and how you interact with the App, such as your IP address, device type, operating system, and browsing actions.</Text>

      <Text style={styles.sectionTitle}>Use of Your Information</Text>

      <Text style={styles.paragraph}>
        We may use the information we collect from you to:
      </Text>

      <Text style={styles.listItem}>- Provide, maintain, and improve the App;</Text>
      <Text style={styles.listItem}>- Analyze usage of the App and improve our services;</Text>
      <Text style={styles.listItem}>- Respond to your inquiries and fulfill your requests;</Text>
      <Text style={styles.listItem}>- Send you administrative information, such as updates, security alerts, and support messages;</Text>
      <Text style={styles.listItem}>- Comply with legal and regulatory requirements.</Text>

      <Text style={styles.sectionTitle}>Sharing of Your Information</Text>

      <Text style={styles.paragraph}>
        We may share your information with third parties only in the following circumstances:
      </Text>

      <Text style={styles.listItem}>- With service providers who assist us in operating the App and providing services to you;</Text>
      <Text style={styles.listItem}>- With your consent or at your direction;</Text>
      <Text style={styles.listItem}>- To comply with legal obligations or protect our rights.</Text>

      <Text style={styles.sectionTitle}>Data Security</Text>

      <Text style={styles.paragraph}>
        We take reasonable measures to protect the information we collect from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, so we cannot guarantee absolute security.
      </Text>

      <Text style={styles.sectionTitle}>Children's Privacy</Text>

      <Text style={styles.paragraph}>
        Our App is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can delete the information.
      </Text>

      <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>

      <Text style={styles.paragraph}>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </Text>

      <Text style={styles.sectionTitle}>Contact Us</Text>

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={openEmail} style={styles.icon}>
          <Ionicons name="mail" size={28} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openLinkedIn} style={styles.icon}>
          <Ionicons name="logo-linkedin" size={28} color="#007bff" />
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 20 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom:20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 13,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 20,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20, 
  },
  icon: {
    marginHorizontal: 10,
    marginBottom:15,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default PrivacyPolicy;
