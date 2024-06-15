import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import CurrencySelectionModal from "../../Utils/CurrencySelectionModal";
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
const CurrencyPreferencesView = ({
  navigation,
  selectedTheme,
  setSelectedTheme,
  showCurrencyModal,
  setShowCurrencyModal,
  handleThemeChange,
  selectedCurrency
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading}>Select Currency</Text>
        <ClosedDropdown
          text={selectedCurrency.name}
          onPress={() => setShowCurrencyModal(true)}
        />
      </View>

    </View>
  );
};
export default CurrencyPreferencesView;

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
    flex: 1
  },
  customDropDownIcon: {
    marginLeft: 10
  }
});
