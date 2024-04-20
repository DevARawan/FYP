import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSelector } from "react-redux";

// import Toast from 'react-native-toast-message';
import firestore from "@react-native-firebase/firestore";
import { CircularProgressBar } from "../Components/CircularProgressBar";
import { useAuthContext } from "../Hooks/UseAuth";
import CurrencySelectionModal from "../Utils/CurrencySelectionModal";
import { getMedal } from "../Utils/MedalUtils";
import AnimatedLottieView from "lottie-react-native";
import LottieView from "lottie-react-native";

const HomeScreen = () => {
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [allGoals, setAllGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { currentUser } = useAuthContext();
  const [isCelebrationsDialogVisible, setIsCelebrationsDialogVisible] =
    useState(false);
  const [isCelebrationsVisible, setIsCelebrationsVisible] = useState(false);
  const [userLevel, setUserLevel] = useState('🏅');

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

      fetchAchievements(totalIncome, totalOverallExpenses);
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

      setAllGoals(goals);
      // You can set the fetched goals to state or perform any other actions here
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };
  const sumAchievemntsAmount = (achievements) => {
    // Use reduce to calculate the sum of totalAmount
    const total = achievements.reduce((sum, achievement) => {
      // Convert totalAmount to a number and add it to the sum
      return sum + Number(achievement.totalAmount);
    }, 0); // Start with an initial sum of 0
    return total;
  };

  const fetchAchievements = async (totalIncome, totalOverallExpenses) => {
    try {
      // Get a reference to the Firestore collection of achievements under the user's collection
      const achievementsCollectionRef = firestore().collection(
        `users/${userId}/achievements`
      );

      // Fetch documents from the achievements collection
      const achievementsSnapshot = await achievementsCollectionRef.get();
      let achievements = [];

      // Log each document in the achievements collection
      achievementsSnapshot.forEach((doc) => {
        const achievementData = doc.data();
        const achievement = {
          id: achievementData.id,
          dueDate: achievementData.dueDate,
          goalName: achievementData.goalName,
          goalDescription: achievementData.goalDescription,
          totalAmount: achievementData.totalAmount
          // Add other fields as needed
        };

        achievements.push(achievement);
      });

      // Do whatever you need with the fetched achievements (e.g., set state)

      if (achievements.length > 0) {
        const sumAchievemnts = sumAchievemntsAmount(achievements);
        const savingsWithoutAchievements = totalIncome - totalOverallExpenses;
        setSavingsAmount(savingsWithoutAchievements - sumAchievemnts);
        const medal = getMedal(achievements.length);
        setUserLevel(medal);
      } else {
        setSavingsAmount(totalIncome - totalOverallExpenses);
      }
      // You can set the fetched achievements to state or perform any other actions here
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  const CelebrationBottomSheet = ({ visible, onClose }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.bottomSheet}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Image
              source={require("../Images/celebrations.gif")} // Replace with your GIF
              style={styles.gif}
            />
            <Text style={styles.text}>Next</Text>
            <View
              style={{ position: "absolute", height: "100%", width: "100%" }}
            >
              <LottieView
                style={{
                  width: 200,
                  height: 200,
                  alignSelf: "center"
                }}
                source={require("../../Animations/fireworks.json")}
                autoPlay
                loop
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const moveGoalToAchievemnt = async (selectedGoal) => {
    // Make a Firebase call to delete the selected goal from the goals collection
    const goalsCollectionRef = firestore().collection(`users/${userId}/goals`);
    await goalsCollectionRef.doc(selectedGoal.id).delete();
    // Add the selected goal to the achievements collection under the user's collection
    const achievementsCollectionRef = firestore().collection(
      `users/${userId}/achievements`
    );
    await achievementsCollectionRef.add(selectedGoal);
    fetchExpenses();
    fetchGoals();
    setIsCelebrationsDialogVisible(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCelebrationsDialogVisible(false);
    setIsCelebrationsVisible(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCelebrationsVisible(false);
  };

  const checkAndUpdateGoals = async (savingsAmount, goals) => {
    try {
      // Check if there are any goals
      if (goals.length > 0) {
        const selectedGoal = goals[0]; // Selecting the first goal for now

        // Check if the goal has already been moved to achievements
        const isGoalAchieved = await isGoalMovedToAchievements(
          selectedGoal.goal_id
        );

        if (isGoalAchieved) {
          return;
        }

        // Check if savings amount is greater than or equal to the total amount of the selected goal
        if (savingsAmount >= selectedGoal.totalAmount) {
          Alert.alert(
            "Congratulations",
            `Goal ${selectedGoal.goalName} can now be achieved. Do you want to proceed?`,
            [
              {
                text: "Cancel",
                onPress: () => {
                  // Handle cancel action
                },
                style: "cancel"
              },
              {
                text: "OK",
                onPress: () => {
                  moveGoalToAchievemnt(selectedGoal);
                }
              }
            ],
            { cancelable: false }
          );
        } else {
        }
      } else {
      }
    } catch (error) {
      console.error("Error checking and updating goals:", error);
    }
  };

  const isGoalMovedToAchievements = async (goalId) => {
    try {
      // Query the achievements collection to check if a document with the given goalId exists
      const achievementsSnapshot = await firestore()
        .collection(`users/${userId}/achievements`)
        .where("goal_id", "==", goalId)
        .get();

      // Check if any documents were found
      return !achievementsSnapshot.empty;
    } catch (error) {
      console.error("Error checking if goal is moved to achievements:", error);
      return false; // Return false in case of error
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
  }, [useIsFocused()]);

  useEffect(() => {
    checkAndUpdateGoals(savingsAmount, allGoals);
  }, [savingsAmount, allGoals]);

  const selectedCurrency = useSelector((state) => state.currency.currency);

  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Leaderboard");
        }}
        style={{ alignItems: "flex-end", paddingHorizontal: 10 }}
      >
        <Text style={styles.medal}>{userLevel}</Text>
      </TouchableOpacity>
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
          currentAmount={savingsAmount} // Assuming savingsAmount represents the current amount saved
          totalAmount={allGoals.length > 0 ? allGoals[0].totalAmount : 0} // Assuming allGoals is an array of goals and you want to show progress for the first goal
          // nextGoal={NextGoalHandler}
          // ForwardToAchieveHandler={ForwardToAchieveHandler}
          // celebrationHandler={setshowCelebration}
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

      <CurrencySelectionModal
        visible={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
      />

      {isCelebrationsVisible && (
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute"
          }}
        >
          <LottieView
            style={{
              width: 200,
              height: 200,
              alignSelf: "center",
              marginBottom: 50
            }}
            source={require("../../Animations/Stars.json")}
            autoPlay
            loop
          />
          <LottieView
            style={{
              width: 200,
              height: 170,
              alignSelf: "center",
              position: "absolute"
            }}
            source={require("../../Animations/fireworks.json")}
            autoPlay
            loop
          />
        </View>
      )}
      {isCelebrationsDialogVisible && (
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute"
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => console.log("Modal has been closed.")}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Congratulations! you have achieved your goal
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      )}
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  bottomSheet: {
    backgroundColor: "white",
    alignItems: "center",
    paddingBottom: 40,
    width: "100%",
    paddingTop: 20
  },
  gif: {
    width: 150,
    height: 150
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10
  },
  medal: { color: "red", fontSize: 40 },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: "92%", // Make the modal view 90% of the screen width
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center", justifyContent:'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15, 
    textAlign: "center"
  }
});

export default HomeScreen;
