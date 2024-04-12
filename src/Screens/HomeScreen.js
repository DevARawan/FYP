import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
// import Toast from 'react-native-toast-message';
import { FIREBASE_APP as app, FIREBASE_DB } from "../../firebaseConfig";
import messaging from "@react-native-firebase/messaging";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  setDoc,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import CircularProgressBar from "../Components/Progressbar";
import { useAuthContext } from "../Hooks/UseAuth";
import uuid from "react-native-uuid";
import ConfettiCannon from "react-native-confetti-cannon";
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
  const db = getFirestore(app);

  const handleDataEntry = () => {
    navigation.navigate("dataEntry");
  };
  const handleManageGoals = () => {
    navigation.navigate("manageGoals");
  };

  const getAllExpenseDetail = async () => {
    // const user = await AsyncStorage.getItem("user");
    // const userId = JSON.parse(user)?.user?.uid;
    const userId = currentUser.uid;
    console.log("userId", userId);
    const what = collection(FIREBASE_DB, `users`, userId, "expenses");
    console.log("userId", userId);
    const snapshot = await getDocs(what);

    const expensesCollection = firestore()
      .collection("users")
      .doc(userId)
      .collection("expenses")
      .doc();

    console.log("expensesCollection", expensesCollection);
    const expenseDocRef = expensesCollection.doc();

    const userDocSnapshot = await expenseDocRef.get();
    let payload = [];
    snapshot.forEach((doc) => {
      try {
        const userData = doc.data();
        if (userData[`user_id`] == userId) {
          payload.push(userData);
        }
      } catch (error) {
        console.error(error);
      }
      // Process each document as needed
    });
    const totalIncome = payload.reduce(
      (acc, data) => Number(acc) + Number(data.income),
      0
    );

    const totalExpense = payload.reduce((accumulator, currentValue) => {
      const expenses = currentValue.expenseAmounts;
      const expenseValues = Object.values(expenses);
      const expenseSum = expenseValues.reduce(
        (sum, value) => sum + Number(value),
        0
      );
      return accumulator + expenseSum;
    }, 0);
    setSavingsAmount(totalIncome - totalExpense);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const myuser1 = await AsyncStorage.getItem("user");
      const myuser = JSON.parse(myuser1);
      // Get user document from Firestore
      const userCollection = collection(db, "users");
      const userDoc = doc(userCollection, myuser.user.uid);
      // Get goals collection from user document
      const goalsRef = collection(userDoc, "goals");
      // Fetch documents from goals collection
      const goalsSnapshot = await getDocs(goalsRef);

      // Store goals data in an array
      let goals = [];
      const goalsData = goalsSnapshot.docs.map((doc) => {
        const goalData = doc.data();
        if (goalData.user_id == myuser.user.uid) {
          goals.push({
            id: doc.id,
            goalName: goalData.newGoal.goalName,
            goalDescription: goalData.newGoal.description,
            totalAmount: goalData.newGoal.totalAmount,
            dueDate: goalData.newGoal.dueDate || null,
            user_id: goalData?.user_id,
            goal_id: goalData?.goal_id
          });
        }
      });
      setAllGoals(goals);
      setIsLoading(false);
      // Do whatever you need with goalsData here
    } catch (error) {
      console.error("Error fetching user data 2:", error);
    }
  };
  useEffect(() => {
    getAllExpenseDetail();
    fetchData();
  }, [useIsFocused()]);
  let count = 0;
  const ForwardToAchieveHandler = async (goal) => {
    ++count;
    if (count == 2) {
      count = 0;
      return;
    }
    const achievementId = uuid.v4();
    let achieve = {
      ...goal,
      goal_id: achievementId
    };

    try {
      const user = await AsyncStorage.getItem("user");
      const userId = JSON.parse(user)?.user?.uid;
      const db = getFirestore(app);
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, userId);
      const goalsCollection = collection(userDocRef, "achieve");
      const goalsDocRef = doc(goalsCollection, achievementId);
      setDoc(goalsDocRef, {
        achieve
      });

      fetchData();
      Reward();
    } catch (error) {
      console.error(error);
    }
  };

  const NextGoalHandler = async (goal, progressHandler) => {
    setshowCelebration(false);
    setAllGoals(allGoals.filter((data) => data.goalName != goal.goalName));

    try {
      const user = await AsyncStorage.getItem("user");
      const userId = JSON.parse(user)?.user?.uid;
      const db = getFirestore(app);
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, userId);
      const goalsCollection = collection(userDocRef, "goals");

      const goalDocRef = doc(goalsCollection, goal?.goal_id); // Assuming goalId is the ID of the goal you want to delete
      await deleteDoc(goalDocRef);
      ForwardToAchieveHandler(goal);

      progressHandler(0);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };
  const selectedCurrency = useSelector((state) => state.currency.currency);
  const Reward = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const userId = JSON.parse(user)?.user?.uid;
      const db = getFirestore(app);
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, userId);
      const goalsCollection = collection(userDocRef, "achieve");
      const achieveSnapshot = await getDocs(goalsCollection);

      if (achieveSnapshot.size >= 3 && achieveSnapshot.size <= 5) {
        setAchieveStatus("matel");
      } else if (achieveSnapshot.size >= 8) {
        setAchieveStatus("gold");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserCurrency = () => {};
  useEffect(() => {
    Reward();
    fetchUserCurrency();
  }, []);

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
        <CircularProgressBar
          currentGoal={allGoals[0]}
          savingIncome={savingsAmount}
          nextGoal={NextGoalHandler}
          ForwardToAchieveHandler={ForwardToAchieveHandler}
          celebrationHandler={setshowCelebration}
        />
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
