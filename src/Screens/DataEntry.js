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
import { Timestamp } from "firebase/firestore";
import { useToast } from "react-native-toast-notifications";

const DataEntry = () => {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [incomes, setIncomes] = useState([{ name: "", amount: "" }]);

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
  const savingAmount = useSelector((state) => state.saving.savingAmount);
  const toast = useToast();
  const addIncomeField = () => {
    setIncomes([...incomes, { name: "", amount: "" }]);
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
    setTotalIncome(0);
    setIncomes([]);
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
                  <Text style={styles.label}>Income Name:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter income name"
                      value={item.name}
                      onChangeText={(text) => {
                        const newIncomes = [...incomes];
                        newIncomes[index].name = text;
                        setIncomes(newIncomes);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Income Amount:</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.dollarSign}>{currencySymbol}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter income amount"
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
    let totalExpense = 0;
    for (const key in expenseAmounts) {
      const value = expenseAmounts[key];
      if (!isNaN(value) && value !== "") {
        totalExpense += parseFloat(value);
      }
    }

    if (totalIncome > 0 || totalExpense > 0) {
      setIsLoading(true);
      setIsButtonDisabled(true);

      if (totalIncome + savingAmount < totalExpense) {
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
            expense_id: expenseDocRef.id,
            time: Date.now()
          });
          clearData();
          toast.show(`Data Added Successfully`, {
            type: "success",
            placement: "top",
            offset: 30,
            animationType: "zoom-in",
            duration: 3500
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
    } else {
      Alert.alert("Please add some data to proceed");
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
          date: date, // Update the date if needed
          time: Date.now()
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
      navigation.navigate("main");
      toast.show(`Data Updated Successfully`, {
        type: "success",
        placement: "top",
        offset: 30,
        animationType: "zoom-in",
        duration: 3500
      });
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
                console.log(expenses);
                if (expenses.length > 0) {
                  const sortedExpenses = expenses.sort(
                    (a, b) => b?.time - a?.time
                  );
                  console.log("expenses:", JSON.stringify(expenses));
                  console.log(
                    "sortedExpenses:",
                    JSON.stringify(sortedExpenses)
                  );

                  // Select the latest expense to edit
                  setSelectedIncomeToEdit(sortedExpenses[0]);

                  setExpenseAmounts({
                    Electricity: sortedExpenses[0]?.expenseAmounts?.Electricity,
                    Gas: sortedExpenses[0]?.expenseAmounts?.Gas,
                    Grocery: sortedExpenses[0]?.expenseAmounts?.Grocery,
                    Fuel: sortedExpenses[0]?.expenseAmounts?.Fuel,
                    Clothes: sortedExpenses[0]?.expenseAmounts?.Clothes,
                    Other: sortedExpenses[0]?.expenseAmounts?.Other
                  });

                  setShowAddIncome(true);
                  setPlusIcon(false);
                  setIncomes(sortedExpenses[0]?.incomeList);
                  setTotalIncome(sortedExpenses[0]?.income);
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
