import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  setDoc,
  getDocs
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const DataEntry = () => {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState(null);
  const [expenseAmounts, setExpenseAmounts] = useState({
    Electricity: "",
    Gas: "",
    Grocery: "",
    Fuel: "",
    Clothes: "",
    Other: ""
  });
  const [plusIcon, setPlusIcon] = useState(true);
  const [isButtonDistable, setIsButtonDistable] = useState(false);
  const navigation = useNavigation();

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
                  [category]: text
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
    setIsButtonDistable(true);
    if (!incomeAmount) {
      Alert.alert("Please provide income details");
      setIsButtonDistable(false);
      return;
    }

    let totalExpense = 0;
    for (const key in expenseAmounts) {
      const value = expenseAmounts[key];
      if (!isNaN(value) && value !== "") {
        totalExpense += parseFloat(value);
      }
    }

    if (incomeAmount < totalExpense) {
      Alert.alert("Your expenses exceed your income");
      setIsButtonDistable(false);
      return;
    }

    try {
      const user = await AsyncStorage.getItem("user");
      const userId = JSON.parse(user)?.user?.uid;
      if (!userId) {
        setIsButtonDistable(false);
        throw new Error("User ID not found");
      }

      const usersCollection = collection(FIREBASE_DB, "users");
      console.log("userid", userId);

      const userDocRef = doc(usersCollection, userId);
      // const userDocRef = doc(collection(FIREBASE_DB, "users"), userId);
      const userDocSnapshot = await getDoc(userDocRef);

      console.log("data", JSON.stringify(userDocSnapshot.data()));

      if (userDocSnapshot.exists()) {
        const expensesCollection = collection(userDocRef, "expenses");
        const expenseDocRef = doc(expensesCollection);

        await setDoc(expenseDocRef, {
          expenseAmounts,
          income: incomeAmount,
          user_id: userId
        });
        console.log("Expense document added successfully");
        navigation.navigate("main");
        setIsButtonDistable(false);
      } else {
        setIsButtonDistable(false);
        throw new Error("User document not found");
      }
    } catch (error) {
      setIsButtonDistable(false);
      console.error("Error occurred:", error);
      Alert.alert("Error occurred while processing the request");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add Income and Expenses</Text>

      <TouchableOpacity style={styles.row} onPress={handleToggleIcon}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>My Income:</Text>
          <Text style={styles.value}>{incomeAmount}</Text>

          <Feather
            name={plusIcon ? "plus" : "minus"}
            size={28}
            color="#007AFF"
            style={{ marginLeft: 5 }}
          />
        </View>
      </TouchableOpacity>

      {renderAddIncome()}

      <View style={styles.column}>
        <Text
          style={[styles.categoryLabel, { fontSize: 20, marginBottom: 15 }]}
        >
          Expenses:
        </Text>
        <View style={styles.row}>
          <Text style={styles.categoryLabel}>Categories</Text>
          <Text style={styles.amountLabel}>Amount</Text>
        </View>
        {renderAddExpenses()}
      </View>

      <TouchableOpacity
        disabled={isButtonDistable}
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 40,
    marginTop: 7
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 5
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10
  },
  amountLabel: {
    fontSize: 18,
    fontWeight: "bold",
    width: "30%", // Adjust the width as needed
    marginLeft: 45
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 20
  },
  category: {
    fontSize: 16,
    marginRight: 1,
    width: "40%" // Adjust the width as needed
  },
  value: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding: 9,
    width: "52%" // Adjust the width as needed
  },
  inputContainer: {
    width: "59.5%", // Adjust the width as needed
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "100%" // Ensure the input takes the full width
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 30,
    alignItems: "center"
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default DataEntry;
