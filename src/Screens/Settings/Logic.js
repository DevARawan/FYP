import { useState } from "react";
import { Animated } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from "react-redux";
import { useAuthContext } from "../../Hooks/UseAuth";

const SettingsBusinessLogic = ({ children, navigation }) => {
  const [showGenerateOptions, setShowGenerateOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedRow, setSelectedRow] = useState("");
  const { signOut } = useAuthContext();
  const [blinkAnimation] = useState(new Animated.Value(0));
  const user = useSelector((state) => state.user.user);
  const handleProfile = () => {
    navigation.navigate("profile");
  };

  const handleGenerateOptionsToggle = () => {
    setShowGenerateOptions(!showGenerateOptions);
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option === selectedOption ? "" : option);
    startBlinkingAnimation();
    setTimeout(() => {
      setShowNotifications(false); // Close the dropdown after 1 second
    }, 100);
  };

  const handleOption = (option) => {
    setSelectedRow(option === selectedOption ? "" : option);
    startBlinkingAnimation();
    setTimeout(() => {
      setShowGenerateOptions(false); // Close the dropdown after 1 second
    }, 100);
  };

  const handleLogout = async () => {
    await signOut();
    navigation.navigate("FrontScreen");
  };

  const handleAchievements = () => {
    navigation.navigate("Achievements");
  };

  const handlePolicy = () => {
    navigation.navigate("PrivacyPolicy");
  };

  const handleGeneral = () => {
    navigation.navigate("CurrencyPreferences");
  };

  const startBlinkingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(blinkAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  return children({
    navigation,
    showGenerateOptions,
    setShowGenerateOptions,
    showNotifications,
    setShowNotifications,
    selectedOption,
    setSelectedOption,
    selectedRow,
    setSelectedRow,
    signOut,
    blinkAnimation,
    user,
    handleProfile,
    handleGenerateOptionsToggle,
    handleNotifications,
    handleOptionSelect,
    handleOption,
    handleLogout,
    handleAchievements,
    handlePolicy,
    handleGeneral,
    startBlinkingAnimation
  });
};
export default SettingsBusinessLogic;
