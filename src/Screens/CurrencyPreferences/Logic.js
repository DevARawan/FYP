import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useSelector } from "react-redux";
const CurrencyPreferencesBusinessLogic = ({ children, navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState("light"); // Default theme
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  // const handleThemeChange = async (value) => {
  //   setSelectedTheme(value);
  //   await AsyncStorage.setItem("selectedTheme", value);
  // };
  const selectedCurrency = useSelector((state) => state.currency.currency);
  return children({
    navigation,
    showCurrencyModal,
    setShowCurrencyModal,
    selectedCurrency
  });
};
export default CurrencyPreferencesBusinessLogic;
