import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Loader from "../../Utils/Loader";

const ExpenseReportsView = ({
  navigation,
  expensesData,
  setExpensesData,
  incomeData,
  setIncomeData,
  savingsData,
  setSavingsData,
  datesData,
  setDatesData,
  isLoading,
  setIsLoading,
  currentUser,
  userId,
  chartColors,
  screenWidth
}) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          {/* Expenses LineChart */}
          {expensesData.length > 0 ||
          incomeData.length > 0 ||
          savingsData.length > 0 ? (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: datesData, // Format dates for display
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
          ) : (
            <View>
              <Text>Not enough data</Text>
            </View>
          )}
          {expensesData.length > 0 && (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: datesData, // Format dates for display
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
                  labels: datesData, // Format dates for display
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
                  labels: datesData, // Format dates for display
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
export default ExpenseReportsView;

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
