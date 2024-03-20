import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dropdown = ({ data, selectedValue, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.dropdown}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>{selectedValue}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modal}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { onSelect(item.value); setModalVisible(false); }}>
                <Text style={styles.modalItem}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.value}
          />
        </View>
      </Modal>
    </View>
  );
};

const General = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('light'); // Default theme
  const [languages, setLanguages] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Load languages and currencies
    loadLanguages();
    loadCurrencies();
  }, []);

  const loadLanguages = async () => {
    const languagesData = [
      { label: 'English', value: 'en' },
      { label: 'Urdu', value: 'ur' },
      { label: 'Punjabi', value: 'pa' },
      { label: 'Sindhi', value: 'sd' },
      { label: 'Pashto', value: 'ps' },
      { label: 'Balochi', value: 'bal' },
      { label: 'Spanish', value: 'es' },
      { label: 'Italian', value: 'it' },
      // Add more languages as needed
    ];
    setLanguages(languagesData);
    const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (storedLanguage) setSelectedLanguage(storedLanguage);
  };

  const loadCurrencies = async () => {
    const currenciesData = [
      { label: 'USD - US Dollar', value: 'USD' },
      { label: 'EUR - Euro', value: 'EUR' },
      { label: 'GBP - British Pound', value: 'GBP' },
      { label: 'PKR - Pakistani Rupee', value: 'PKR' },
      { label: 'INR - Indian Rupee', value: 'INR' },
      { label: 'JPY - Japanese Yen', value: 'JPY' },
      { label: 'CNY - Chinese Yuan', value: 'CNY' },
      // Add more currencies as needed
    ];
    setCurrencies(currenciesData);
    const storedCurrency = await AsyncStorage.getItem('selectedCurrency');
    if (storedCurrency) setSelectedCurrency(storedCurrency);
  };

  const handleLanguageChange = async (value) => {
    setSelectedLanguage(value);
    await AsyncStorage.setItem('selectedLanguage', value);
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
        <Text style={styles.heading}>Select Language</Text>
        <Dropdown
          data={languages}
          selectedValue={selectedLanguage}
          onSelect={handleLanguageChange}
        />
      </View>

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
    paddingVertical: 40,
  },
  section: {
    marginBottom: 30,
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
    padding: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalItem: {
    padding: 10,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    textAlign: 'center',
  },
});

export default General;
