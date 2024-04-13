import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { useSelector } from "react-redux";

// import Toast from 'react-native-toast-message';
import firestore from "@react-native-firebase/firestore";
import { useAuthContext } from "../Hooks/UseAuth";
import CircularProgressBar from "../Components/Progressbar";
import CurrencySelectionModal from "../Utils/CurrencySelectionModal";

const HomeScreen = () => {
  const [savingsAmount, setSavingsAmount] = useState("");
  const [allGoals, setAllGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setshowCelebration] = useState(false);
  const [achieveStatus, setAchieveStatus] = useState("silver");
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { currentUser } = useAuthContext();
  const navigation = useNavigation();
  const userId = currentUser.uid;
  const fetchExpenses = async () => {
    try {
      // Get a reference to the Firestore collection of expenses under the user's collection
      const expensesCollectionRef = firestore().collection(
        `users/${userId}/expenses`
      );

      // Fetch documents from the expenses collection
      const expensesSnapshot = await expensesCollectionRef.get();
      let totalIncome = 0;
      let totalExpenses = {
        Clothes: 0,
        Electricity: 0,
        Fuel: 0,
        Gas: 0,
        Grocery: 0,
        Other: 0
      };
      // Log each document in the expenses collection
      expensesSnapshot.forEach((doc) => {
        const income = Number(doc.data().income);
        totalIncome += income;
        Object.keys(doc.data().expenseAmounts).forEach((category) => {
          const expenseAmount = Number(doc.data().expenseAmounts[category]);
          totalExpenses[category] += expenseAmount;
        });
      });

      const totalOverallExpenses = Object.values(totalExpenses).reduce(
        (total, expense) => total + expense,
        0
      );

      setSavingsAmount(totalIncome - totalOverallExpenses);
    } catch (error) {
      console.error("Error fetching and logging expenses:", error);
    }
  };
  const fetchGoals = async () => {
    try {
      // Get a reference to the Firestore collection of goals under the user's collection
      const goalsCollectionRef = firestore().collection(
        `users/${userId}/goals`
      );

      // Fetch documents from the goals collection
      const goalsSnapshot = await goalsCollectionRef.get();
      let goals = [];

      // Log each document in the goals collection
      goalsSnapshot.forEach((doc) => {
        const goalData = doc.data();
        const goal = {
          id: doc.id,
          goalName: goalData.newGoal.goalName,
          goalDescription: goalData.newGoal.description,
          totalAmount: goalData.newGoal.totalAmount,
          dueDate: goalData.newGoal.dueDate || null,
          user_id: goalData.user_id,
          goal_id: goalData.goal_id
        };
        goals.push(goal);
      });

      // Do whatever you need with the fetched goals (e.g., set state)
      console.log("Fetched goals:", goals);
      setAllGoals(goals);
      // You can set the fetched goals to state or perform any other actions here
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleDataEntry = () => {
    navigation.navigate("dataEntry");
  };
  const handleManageGoals = () => {
    navigation.navigate("manageGoals");
  };

  useEffect(() => {
    fetchExpenses();
    fetchGoals();
  }, []);

  const selectedCurrency = useSelector((state) => state.currency.currency);

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View style={{ alignItems: "flex-end", paddingHorizontal: 10 }}>
        <Text style={{ color: "red" }}>
          {achieveStatus == "silver"
            ? "🥈"
            : achieveStatus == "matel"
            ? "🥉"
            : "🏅"}
        </Text>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={handleDataEntry}>
          <Text style={styles.navButtonText}>Manage Data Entry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleManageGoals}>
          <Text style={styles.navButtonText}>Manage Goals</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <Text style={styles.heading}>Dashboard</Text>
      <View style={{ alignSelf: "center" }}>
        {/* <CircularProgressBar
          currentGoal={allGoals[0]}
          savingIncome={savingsAmount}
          nextGoal={NextGoalHandler}
          ForwardToAchieveHandler={ForwardToAchieveHandler}
          celebrationHandler={setshowCelebration}
        /> */}
      </View>

      <View style={styles.savingsContainer}>
        <Text style={styles.savingsText}>Savings Amount: </Text>
        <View style={styles.curvedBox}>
          <Text style={styles.savingsAmount}>
            {selectedCurrency.symbol}
            {savingsAmount}
          </Text>
        </View>
      </View>

      {allGoals.length > 0 ? (
        allGoals.map((goal) => (
          <View style={styles.currentGoalContainer} key={goal.id}>
            <Text style={styles.currentGoalText}>Current Goal</Text>
            <View style={styles.goalBox}>
              <View style={styles.goalDetailContainer}>
                <Text style={styles.goalDetailLabel}>Goal Name:</Text>
                <View style={styles.textbox}>
                  <Text style={styles.goalDetailValue}>{goal.goalName}</Text>
                </View>
              </View>

              <View style={styles.goalDetailContainer}>
                <Text style={styles.goalDetailLabel}>Description:</Text>
                <View style={styles.textbox}>
                  <Text style={styles.goalDetailValue}>
                    {goal.goalDescription}
                  </Text>
                </View>
              </View>

              <View style={styles.goalDetailContainer}>
                <Text style={styles.goalDetailLabel}>Total Amount:</Text>
                <View style={styles.textbox}>
                  <Text style={styles.goalDetailValue}>
                    ${goal.totalAmount}
                  </Text>
                </View>
              </View>
              <View style={styles.goalDetailContainer}>
                <Text style={styles.goalDetailLabel}>Due Date:</Text>
                <View style={styles.textbox}>
                  <Text style={styles.goalDetailValue}>
                    {goal.dueDate || "No Due Date"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          WE ARE LOADING YOUR GOALS.
        </Text>
      )}
      {showCelebration && (
        <ConfettiCannon fadeOut={true} count={1000} origin={{ x: 10, y: 0 }} />
      )}
      <CurrencySelectionModal
        visible={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 12
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  navbar: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between"
  },
  navButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5
  },
  navButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  separator: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
    marginVertical: 12
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 10,
    textAlign: "center"
  },
  savingsContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center"
  },
  savingsText: {
    fontSize: 18
  },
  curvedBox: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 150
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff"
  },
  currentGoalContainer: {
    marginTop: 20,
    backgroundColor: "lightgrey",
    width: "100%",
    padding: 15,
    borderRadius: 10
  },
  currentGoalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  goalBox: {
    backgroundColor: "lightgrey",
    borderRadius: 15,
    padding: 5,
    marginTop: 10
  },
  goalDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },
  goalDetailLabel: {
    fontSize: 16,
    marginRight: 5,
    width: 100
  },
  textbox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 9,
    flex: 1
  },
  goalDetailValue: {
    fontSize: 16,
    fontWeight: "bold"
  },
  progressBarContainer: {
    alignItems: "center",
    marginTop: 10
  }
});

export default HomeScreen;
