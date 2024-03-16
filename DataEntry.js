import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import app from './Components/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  doc, getDoc, getFirestore, collection, setDoc } from 'firebase/firestore';


const DataEntry = () => {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState('50000');
  const [expenseAmounts, setExpenseAmounts] = useState({
    Electricity: '',
    Gas: '',
    Grocery: '',
    Fuel: '',
    Clothes: '',
    Other: '',
  });
  const [plusIcon, setPlusIcon] = useState(true);

  const renderAddIncome = () => {
    if (showAddIncome) {
      return (
        <View style={styles.row}>
          <Text style={styles.label}>Add Income:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter income"
              keyboardType="numeric"
              value={incomeAmount}
              onChangeText={(text) => setIncomeAmount(text)}
            />
          </View>
        </View>
      );
    }
    return null;
  };

  const renderAddExpenses = () => (
    <View style={styles.column}>
      {Object.keys(expenseAmounts).map((category) => (
        <View key={category} style={styles.row}>
          <Text style={styles.category}>{category}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={expenseAmounts[category]}
              onChangeText={(text) =>
                setExpenseAmounts((prevAmounts) => ({
                  ...prevAmounts,
                  [category]: text,
                }))
              }
            />
          </View>
        </View>
      ))}
    </View>
  );

  const handleToggleIcon = () => {
    setShowAddIncome(!showAddIncome);
    setPlusIcon(!plusIcon);
  };

  const handleSubmit = async () => {
    const user = await AsyncStorage.getItem('user');
    const userId = JSON.parse(user).id;

    const db = getFirestore(app);
    const usersCollection = collection(db, "users");
    const userDocRef = doc(usersCollection, userId);

    // Check if the document exists
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
        // Assuming "expences" is a subcollection of the user document
        const expencesCollection = collection(userDocRef, "expences");
        const expenceDocRef = doc(expencesCollection,userId );
        await setDoc(expenceDocRef, {
            expenseAmounts,
        });
    } else {
        console.error("User document not found");
    }
}


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add Income and Expenses</Text>

      <TouchableOpacity
        style={styles.row} 
        onPress={handleToggleIcon}
      >
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>My Income:</Text>
          <Text style={styles.value}>{incomeAmount}</Text>
        
          <Feather
            name={plusIcon ? 'plus' : 'minus'}
            size={28}
            color="#007AFF"
            style={{ marginLeft: 5 }} 
          />
        </View>
      </TouchableOpacity>

      {renderAddIncome()}

      <View style={styles.column}>
        <Text style={[styles.categoryLabel, {fontSize:20, marginBottom:15}]}>Expenses:</Text>
        <View style={styles.row}>
          <Text style={styles.categoryLabel}>Categories</Text>
          <Text style={styles.amountLabel}>Amount</Text>
        </View>
        {renderAddExpenses()}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
    marginTop:7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight:'bold',
    marginRight: 10,
  },
  amountLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '30%', // Adjust the width as needed
    marginLeft:45,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, marginRight:20,
  },
  category: {
    fontSize: 16,
    marginRight: 1,
    width: '40%', // Adjust the width as needed
  },
  value: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding: 9,
    width: '52%', // Adjust the width as needed
  },
  inputContainer: {
    width: '59.5%', // Adjust the width as needed
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '100%', // Ensure the input takes the full width
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 5, marginBottom:30,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DataEntry;
