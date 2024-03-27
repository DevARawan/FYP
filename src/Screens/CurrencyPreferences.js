import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Dropdown = ({ data, selectedValue, onSelect }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
        <View style={styles.dropdownField}>
          <Text>{selectedValue}</Text>
          <Ionicons name={dropdownVisible ? 'caret-up-outline' : 'caret-down-outline'} size={24} color="black" />
        </View>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { onSelect(item.value); setDropdownVisible(false); }}>
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

const General = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedTheme, setSelectedTheme] = useState('light'); // Default theme
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Load currencies
    loadCurrencies();
  }, []);


  const loadCurrencies = async () => {
    const currenciesData = [
      { label: 'USD - US Dollar', value: 'USD' },
      { label: 'EUR - Euro', value: 'EUR' },
      { label: 'PKR - Pakistani Rupee', value: 'PKR' },
      { label: 'INR - Indian Rupee', value: 'INR' },
      // Add more currencies as needed
    ];
    setCurrencies(currenciesData);
    const storedCurrency = await AsyncStorage.getItem('selectedCurrency');
    if (storedCurrency) setSelectedCurrency(storedCurrency);
  };


  const handleCurrencyChange = async (value) => {
    setSelectedCurrency(value);
    await AsyncStorage.setItem('selectedCurrency', value);
  };

  const handleThemeChange = async (value) => {
    setSelectedTheme(value);
    await AsyncStorage.setItem('selectedTheme', value);
  };

  return (
    <View style={styles.container}>

      <View style={styles.section}>
        <Text style={styles.heading}>Select Currency</Text>
        <Dropdown
          data={currencies}
          selectedValue={selectedCurrency}
          onSelect={handleCurrencyChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Select Theme</Text>
        <Dropdown
          data={[{ label: "Light Mode", value: "light" }, { label: "Dark Mode", value: "dark" }]}
          selectedValue={selectedTheme}
          onSelect={handleThemeChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 40, paddingTop:90,
  },
  section: {
    marginBottom: 80,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden', 
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    maxHeight: 250,
    overflow: 'scroll',
  },
  dropdownMenuItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default General;
