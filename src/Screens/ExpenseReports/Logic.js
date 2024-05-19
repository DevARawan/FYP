import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useAuthContext } from "../../Hooks/UseAuth";
const ExpenseReportsBusinessLogic = ({ children, navigation }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [datesData, setDatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuthContext();
  const userId = currentUser.uid;
  const screenWidth = Dimensions.get("window").width;

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
          const savings =
            income !== null ? (income - totalExpense).toFixed(2) : null;
          const date = doc.data().date; // Convert timestamp to JavaScript Date object
          return {
            totalExpense: totalExpense.toFixed(2),
            income,
            savings,
            date
          };
        });

        // Grouping and summing income by month
        const monthlyIncome = userData.reduce((acc, data) => {
          const date = new Date(data.date);
          const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }
          acc[monthYear] += parseFloat(data.income || 0);
          return acc;
        }, {});

        // Grouping and summing expenses by month
        const monthlyExpenses = userData.reduce((acc, data) => {
          const date = new Date(data.date);
          const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }
          acc[monthYear] += parseFloat(data.totalExpense || 0);
          return acc;
        }, {});

        // Grouping and summing savings by month
        const monthlySavings = userData.reduce((acc, data) => {
          const date = new Date(data.date);
          const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }
          acc[monthYear] += parseFloat(data.savings || 0);
          return acc;
        }, {});

        // Extracting unique months and sorting them
        const uniqueMonths = Object.keys(monthlyIncome).sort();

        // Creating arrays for income, expenses, savings, and dates
        const income = uniqueMonths.map(
          (monthYear) => monthlyIncome[monthYear]
        );
        const expenses = uniqueMonths.map(
          (monthYear) => monthlyExpenses[monthYear]
        );
        const savings = uniqueMonths.map(
          (monthYear) => monthlySavings[monthYear]
        );
        const dates = uniqueMonths.map((monthYear) => new Date(monthYear));
        const monthNamesWithYear = uniqueMonths.map((monthYear) => {
          const [month, year] = monthYear.split("-");
          return `${new Date(year, month - 1, 1).toLocaleString("default", {
            month: "long"
          })} ${year}`;
        });

        setSavingsData(savings);
        setIncomeData(income);
        setExpensesData(expenses);
        setDatesData(monthNamesWithYear); // Set dates data
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
  return children({
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
  });
};
export default ExpenseReportsBusinessLogic;
