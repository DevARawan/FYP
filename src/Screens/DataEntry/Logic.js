import firestore from "@react-native-firebase/firestore";
import { useState } from "react";
import { Alert } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../Hooks/UseAuth";

const DataEntryBusinessLogic = ({ children, navigation }) => {
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
  return children({
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
  });
};
export default DataEntryBusinessLogic;
