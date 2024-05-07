import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DatePicker from "react-native-date-picker";

const UpdateIncomeAndExpenses = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isOpen, setOpen] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Update Income and Expenses</Text>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 10,
          width: "85%", // Ensure the input takes the full width
          paddingLeft: 40,
          alignSelf: "center",
          marginBottom: 20
        }}
        onPress={() => setOpen(true)}
      >
        <Text>Date:{date}</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.label}>Income 1:</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* <View style={styles.row}>
        <Text style={styles.label}>Income 2:</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter income"
            keyboardType="numeric"
          />
        </View>
      </View> */}

      {/* <View style={styles.row}>
        <Text style={styles.label}>Income 3:</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter income"
            keyboardType="numeric"
          />
        </View>
      </View> */}

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
        <View style={styles.row}>
          <Text style={styles.category}>Electricity</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.category}>Gas</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.category}>Grocery</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.category}>Fuel</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.category}>Clothes</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.category}>Other</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Update</Text>
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
  category: {
    fontSize: 16,
    marginRight: 1,
    width: "40%" // Adjust the width as needed
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

export default UpdateIncomeAndExpenses;
