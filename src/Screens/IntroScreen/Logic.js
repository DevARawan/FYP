import { useNavigation } from "@react-navigation/native";

const IntroBusinessLogic = ({ children }) => {
  const navigation = useNavigation();
  const handleLogin = () => {
    navigation.replace("login");
  };

  const handleSignup = () => {
    navigation.replace("Signup");
  };

  return children({
    navigation,
    handleLogin,
    handleSignup
  });
};
export default IntroBusinessLogic;
