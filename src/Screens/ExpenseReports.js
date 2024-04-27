import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useAuthContext } from "../Hooks/UseAuth";
import { useIsFocused } from "@react-navigation/native";
import Loader from "../Utils/Loader";

const screenWidth = Dimensions.get("window").width;

const ExpenseReportScreen = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuthContext();
  const userId = currentUser.uid;

  // Modify the useEffect hook to format the data before setting the state
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const snapshot = await firestore()
          .collection("users")
          .doc(userId)
          .collection("expenses")
          .get();
        const userData = snapshot.docs.map((doc) => {
          const expenseData = doc.data().expenseAmounts;
          const totalExpense = Object.values(expenseData)
            .filter((amount) => !isNaN(parseFloat(amount)))
            .reduce((acc, curr) => acc + parseFloat(curr), 0);
          const incomeValue = parseFloat(doc.data().income);
          const income = isNaN(incomeValue) ? null : incomeValue.toFixed(2);
          console.log("income is:", income);
          const savings =
            income !== null ? (income - totalExpense).toFixed(2) : null;
          return { totalExpense: totalExpense.toFixed(2), income, savings };
        });

        // Extract savings, income, and expenses data into separate arrays
        const savings = userData.map((data) => parseFloat(data.savings)); // Convert to float
        const income = userData.map((data) => parseFloat(data.income)); // Convert to float
        const expenses = userData.map((data) => parseFloat(data.totalExpense)); // Convert to float

        setSavingsData(savings);
        setIncomeData(income);
        setExpensesData(expenses);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Define custom colors for charts
  const chartColors = {
    expenses: "#FF6347", // Tomato
    savings: "#4682B4", // SteelBlue
    income: "#32CD32" // LimeGreen
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          {/* Expenses LineChart */}
          {(expensesData.length > 0 ||
            incomeData.length > 0 ||
            savingsData.length > 0) && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: Array.from(
                    {
                      length: Math.max(
                        expensesData.length,
                        incomeData.length,
                        savingsData.length
                      )
                    },
                    (_, i) => String(i + 1)
                  ),
                  datasets: [
                    {
                      data: expensesData,
                      color: (opacity = 1) => chartColors.expenses,
                      strokeWidth: 2
                    },
                    {
                      data: incomeData,
                      color: (opacity = 1) => chartColors.income,
                      strokeWidth: 2
                    },
                    {
                      data: savingsData,
                      color: (opacity = 1) => chartColors.savings,
                      strokeWidth: 2
                    }
                  ]
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
              <Text style={styles.label}>Summary</Text>
            </View>
          )}
          {expensesData.length > 0 && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: Array.from({ length: expensesData.length }, (_, i) =>
                    String(i + 1)
                  ),
                  datasets: [{ data: expensesData }]
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => chartColors.expenses,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
              <Text style={[styles.label, { color: chartColors.expenses }]}>
                Expenses
              </Text>
            </View>
          )}

          {/* Savings LineChart */}
          {savingsData.length > 0 && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: Array.from({ length: savingsData.length }, (_, i) =>
                    String(i + 1)
                  ),
                  datasets: [{ data: savingsData }]
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => chartColors.savings,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
              <Text style={[styles.label, { color: chartColors.savings }]}>
                Savings
              </Text>
            </View>
          )}

          {/* Income LineChart */}
          {incomeData.length > 0 && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: Array.from({ length: incomeData.length }, (_, i) =>
                    String(i + 1)
                  ),
                  datasets: [{ data: incomeData }]
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => chartColors.income,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
              <Text style={[styles.label, { color: chartColors.income }]}>
                Income
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: "center"
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  }
});

export default ExpenseReportScreen;
