import { Feather } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DatePicker from "react-native-date-picker";
import { useSelector } from "react-redux";
import { useAuthContext } from "../Hooks/UseAuth";
import Loader from "../Utils/Loader";

const DataEntry = () => {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [incomes, setIncomes] = useState([{ amount: "" }]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenseAmounts, setExpenseAmounts] = useState({
    Electricity: "",
    Gas: "",
    Grocery: "",
    Fuel: "",
    Clothes: "",
    Other: ""
  });
  const { currentUser } = useAuthContext();
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [plusIcon, setPlusIcon] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedIncomeToEdit, setSelectedIncomeToEdit] = useState(null);
  const navigation = useNavigation();
  const selectedCurrency = useSelector((state) => state.currency.currency);
  const currencySymbol = selectedCurrency.symbol;
  const [isOpen, setOpen] = useState(false);

  const addIncomeField = () => {
    setIncomes([...incomes, { amount: "" }]);
  };

  const handleIncomeChange = (index, amount) => {
    if (/^\d*\.?\d*$/.test(amount)) {
      const newIncomes = [...incomes];
      newIncomes[index].amount = amount;

      // Calculate total income
      let updatedTotalIncome = 0;
      newIncomes.forEach((income) => {
        const incomeAmount = parseFloat(income.amount) || 0;
        updatedTotalIncome += incomeAmount;
      });

      setIncomes(newIncomes);
      setTotalIncome(updatedTotalIncome);
    }
  };

  const clearData = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setExpenseAmounts({
      Electricity: "",
      Gas: "",
      Grocery: "",
      Fuel: "",
      Clothes: "",
      Other: ""
    });
  };

  const renderAddIncome = () => {
    if (showAddIncome) {
      return (
        <FlatList
          renderItem={({ item, index }) => {
            return (
              <View>
                <View style={styles.row}>
                  <Text style={styles.label}>Income :</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.dollarSign}>{currencySymbol}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter income"
                      keyboardType="numeric"
                      value={item.amount}
                      onChangeText={(text) => handleIncomeChange(index, text)}
                    />
                  </View>
                </View>
              </View>
            );
          }}
          data={incomes}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={() => {
            return (
              <TouchableOpacity onPress={addIncomeField}>
                <Text
                  style={{
                    color: "blue",
                    fontSize: 16,
                    marginBottom: 20,
                    marginLeft: 20
                  }}
                >
                  Add More
                </Text>
              </TouchableOpacity>
            );
          }}
        />
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
            <Text style={styles.dollarSign}>{currencySymbol}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={expenseAmounts[category]}
              onChangeText={(text) => {
                // Validate input to allow only numbers (integers or floats)
                if (/^\d*\.?\d*$/.test(text)) {
                  setExpenseAmounts((prevAmounts) => ({
                    ...prevAmounts,
                    [category]: text
                  }));
                }
              }}
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
    setIsLoading(true);
    setIsButtonDisabled(true);

    if (totalIncome === 0) {
      Alert.alert("Please provide income details");
      setIsButtonDisabled(false);
      return;
    }

    let totalExpense = 0;
    for (const key in expenseAmounts) {
      const value = expenseAmounts[key];
      if (!isNaN(value) && value !== "") {
        totalExpense += parseFloat(value);
      }
    }

    if (totalIncome < totalExpense) {
      setIsLoading(false);
      clearData();
      Alert.alert(
        "Your expenses exceed your income",
        "Consider exploring loan options to cover your expenses.",
        [
          {
            text: "See Loan Section",
            onPress: () => {
              navigation.navigate("Loans");
            }
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
      setIsButtonDisabled(false);
      return;
    }

    try {
      const userId = currentUser.uid;
      if (!userId) {
        setIsButtonDisabled(false);
        throw new Error("User ID not found");
      }

      const usersCollection = firestore().collection("users");
      const userDocRef = usersCollection.doc(userId);
      const userDocSnapshot = await userDocRef.get();

      if (userDocSnapshot.exists) {
        const expensesCollection = userDocRef.collection("expenses");
        const expenseDocRef = expensesCollection.doc();

        // Include the date in the expense document
        await expenseDocRef.set({
          expenseAmounts,
          income: totalIncome,
          incomeList: incomes,
          user_id: userId,
          date: date, // Add the current date
          expense_id: expenseDocRef.id
        });

        navigation.navigate("main");
        clearData();
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(false);
        clearData();
        throw new Error("User document not found");
      }
      setIsLoading(false);
      clearData();
    } catch (error) {
      clearData();
      setIsLoading(false);
      setIsButtonDisabled(false);
      console.error("Error occurred:", error);
      Alert.alert("Error occurred while processing the request");
    }
  };

  const handleUpdate = async (expenseId) => {
    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      const userId = currentUser.uid;
      if (!userId) {
        setIsButtonDisabled(false);
        throw new Error("User ID not found");
      }

      const usersCollection = firestore().collection("users");
      const userDocRef = usersCollection.doc(userId);
      const userDocSnapshot = await userDocRef.get();

      if (userDocSnapshot.exists) {
        const expensesCollection = userDocRef.collection("expenses");
        const expenseDocRef = expensesCollection.doc(expenseId); // Use the provided expenseId to reference the existing expense document

        // Include the date in the expense document (assuming 'date' and other necessary variables are available)
        await expenseDocRef.update({
          expenseAmounts,
          income: totalIncome,
          incomeList: incomes,
          date: date // Update the date if needed
        });

        setIsEditingMode(false);
        clearData();
        setIsButtonDisabled(false);
      } else {
        setIsButtonDisabled(false);
        clearData();
        throw new Error("User document not found");
      }
      setIsLoading(false);
      clearData();
    } catch (error) {
      clearData();
      setIsLoading(false);
      setIsButtonDisabled(false);
      console.error("Error occurred:", error);
      Alert.alert("Error occurred while processing the request");
    }
  };

  const fetchExpenses = (userId) => {
    return new Promise((resolve, reject) => {
      const expensesRef = firestore()
        .collection("users")
        .doc(userId)
        .collection("expenses");

      expensesRef
        .get()
        .then((querySnapshot) => {
          const expenses = [];
          querySnapshot.forEach((doc) => {
            const expenseData = doc.data();
            expenses.push(expenseData);
          });
          resolve(expenses);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <ScrollView style={styles.container}>
      {!isEditingMode ? (
        <Text style={styles.heading}>Add Income and Expenses</Text>
      ) : (
        <Text style={styles.heading}>Edit Income or Expenses</Text>
      )}

      {!isEditingMode ? (
        <TouchableOpacity
          onPress={() => {
            setIsEditingMode(true);
            setIsLoading(true);
            fetchExpenses(currentUser.uid)
              .then((expenses) => {
                if (expenses.length > 0) {
                  setSelectedIncomeToEdit(expenses[0]);
                  setExpenseAmounts({
                    Electricity: expenses[0]?.expenseAmounts?.Electricity,
                    Gas: expenses[0]?.expenseAmounts?.Gas,
                    Grocery: expenses[0]?.expenseAmounts?.Grocery,
                    Fuel: expenses[0]?.expenseAmounts?.Fuel,
                    Clothes: expenses[0]?.expenseAmounts?.Clothes,
                    Other: expenses[0]?.expenseAmounts?.Other
                  });
                  if (expenses[0]?.incomeList.length > 0) {
                    setShowAddIncome(true);
                    setPlusIcon(false);
                    setIncomes(expenses[0]?.incomeList);
                    setTotalIncome(expenses[0]?.income);
                  }
                } else {
                  Alert.alert("No Previous Data Found", "Add some data First", [
                    {
                      text: "Cancel",
                      style: "cancel",
                      onPress: () => setIsEditingMode(false)
                    },
                    {
                      text: "OK",
                      onPress: () => setIsEditingMode(false)
                    }
                  ]);
                }
              })
              .catch((error) => {
                console.error("Error fetching expenses:", error);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          <Text style={styles.heading}>Edit last Expense</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setIsEditingMode(false);
          }}
        >
          <Text style={styles.heading}>Add New Expense</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          width: "80%",
          paddingLeft: 40,
          alignSelf: "center",
          marginBottom: 20
        }}
        onPress={() => setOpen(true)}
      >
        <Text>Date:{date}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={handleToggleIcon}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>My Income:</Text>
          <Text style={styles.value}>{totalIncome}</Text>
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
        disabled={isButtonDisabled}
        style={styles.submitButton}
        onPress={() => {
          if (isEditingMode) {
            handleUpdate(selectedIncomeToEdit?.expense_id);
          } else {
            handleSubmit();
          }
        }}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : isEditingMode ? (
          <Text style={styles.submitButtonText}>Update</Text>
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>

      <DatePicker
        modal
        open={isOpen}
        maximumDate={new Date()} // Prevent selecting future dates
        date={new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setDate(date.toISOString().split("T")[0]);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <Loader isLoading={isLoading} />
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
    width: "50%" // Adjust the width as needed
  },
  inputContainer: {
    width: "59.5%", // Adjust the width as needed
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "100%", // Ensure the input takes the full width
    paddingLeft: 40
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
  },
  dollarSign: {
    position: "absolute",
    height: "100%",
    left: 10,
    alignSelf: "center",
    textAlignVertical: "center"
  }
});

export default DataEntry;
