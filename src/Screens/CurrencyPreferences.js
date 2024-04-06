import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import CurrencySelectionModal from "../Utils/CurrencySelectionModal";
import { useSelector } from "react-redux";

const Dropdown = ({ data, selectedValue, onSelect }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
        <View style={styles.dropdownField}>
          <Text>{selectedValue}</Text>
          <Ionicons
            name={dropdownVisible ? "caret-up-outline" : "caret-down-outline"}
            size={24}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item.value);
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownMenuItem}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
          />
        </View>
      )}
    </View>
  );
};
const ClosedDropdown = ({ text, iconName = "caret-down-outline", onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.customDropDown}>
      <Text style={styles.customDropDownText}>{text}</Text>
      <Ionicons
        name={iconName}
        size={24}
        color="black"
        style={styles.customDropDownIcon}
      />
    </TouchableOpacity>
  );
};

const General = () => {
  // const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedTheme, setSelectedTheme] = useState("light"); // Default theme
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  // const storedCurrency = await AsyncStorage.getItem("selectedCurrency");
  // if (storedCurrency) setSelectedCurrency(storedCurrency);

  const handleThemeChange = async (value) => {
    setSelectedTheme(value);
    await AsyncStorage.setItem("selectedTheme", value);
  };
  const selectedCurrency = useSelector((state) => state.currency.currency); // A
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Select Currency</Text>
        <ClosedDropdown
          text={selectedCurrency.name}
          onPress={() => setShowCurrencyModal(true)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Select Theme</Text>
        <Dropdown
          data={[
            { label: "Light Mode", value: "light" },
            { label: "Dark Mode", value: "dark" }
          ]}
          selectedValue={selectedTheme}
          onSelect={handleThemeChange}
        />
        <CurrencySelectionModal
          visible={showCurrencyModal}
          onClose={() => setShowCurrencyModal(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 90
  },
  section: {
    marginBottom: 80
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden"
  },
  dropdownField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: "#fff"
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    maxHeight: 250,
    overflow: "scroll"
  },
  dropdownMenuItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  customDropDown: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  customDropDownText: {
    // Renamed the text style
    flex: 1 // Makes text occupy most of the space
  },
  customDropDownIcon: {
    // Renamed the icon style
    marginLeft: 10 // Adds some space between text and icon
  }
});

export default General;
