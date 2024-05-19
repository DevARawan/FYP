import { Linking } from "react-native";
const PrivacyPolictyBusinessLogic = ({ children, navigation }) => {
  const openEmail = () => {
    Linking.openURL("mailto:alrafay182@gmail.com");
  };

  const openLinkedIn = () => {
    Linking.openURL("https://www.linkedin.com/in/abdul-rafay-768906220/");
  };
  return children({
    navigation,
    openEmail,
    openLinkedIn
  });
};
export default PrivacyPolictyBusinessLogic;
