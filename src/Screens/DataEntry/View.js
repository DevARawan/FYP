import { Feather } from "@expo/vector-icons";
import React from "react";
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
import Loader from "../../Utils/Loader";

const DataEntryView = ({
  navigation,
  showAddIncome,
  setShowAddIncome,
  isLoading,
  setIsLoading,
  date,
  setDate,
  incomes,
  setIncomes,
  totalIncome,
  setTotalIncome,
  expenseAmounts,
  setExpenseAmounts,
  currentUser,
  isEditingMode,
  setIsEditingMode,
  plusIcon,
  setPlusIcon,
  isButtonDisabled,
  setIsButtonDisabled,
  selectedIncomeToEdit,
  setSelectedIncomeToEdit,
  selectedCurrency,
  currencySymbol,
  isOpen,
  setOpen,
  savingAmount,
  toast,
  addIncomeField,
  handleIncomeChange,
  clearData,
  handleToggleIcon,
  handleSubmit,
  handleUpdate,
  fetchExpenses
}) => {
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
export default DataEntryView;

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
