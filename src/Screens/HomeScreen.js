import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import LottieView from "lottie-react-native";
import { useToast } from "react-native-toast-notifications";
import { CircularProgressBar } from "../Components/CircularProgressBar";
import { useAuthContext } from "../Hooks/UseAuth";
import { setSavingAmount } from "../Store/reducers/SavingsSlice";
import { setUser } from "../Store/reducers/UserSlice";
import CurrencySelectionModal from "../Utils/CurrencySelectionModal";
import { getMedal } from "../Utils/MedalUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReviewModal from "../Components/ReviewModel";
import Loader from "../Utils/Loader";

const HomeScreen = () => {
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [allGoals, setAllGoals] = useState([]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { currentUser } = useAuthContext();
  const [isCelebrationsDialogVisible, setIsCelebrationsDialogVisible] =
    useState(false);
  const [isCelebrationsVisible, setIsCelebrationsVisible] = useState(false);
  const [AllAchievements, setAllAchievements] = useState([]);

  const [userLevel, setUserLevel] = useState("🏅");
  const [isGoalAchieveable, setGoalAchieveable] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const userId = currentUser?.uid;
  const submitReview = async () => {
    try {
      const reviewCollection = firestore().collection("reviews"); // Change here

      const reviewCollectionRef = reviewCollection.doc();

      await reviewCollectionRef.set({
        review: reviewText,
        rating: 0,
        email: currentUser.email
      });

      setReviewText("");

      setModalVisible(false);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const fetchExpenses = async () => {
    try {
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
      console.log(
        "totalIncome:",
        totalIncome,
        " totalOverallExpenses:",
        totalOverallExpenses
      );
      await fetchAchievements(totalIncome, totalOverallExpenses);
    } catch (error) {
      console.error("Error fetching and logging expenses:", error);
    }
  };
  const fetchGoals = async () => {
    try {
      const goalsCollectionRef = firestore().collection(
        `users/${userId}/goals`
      );
      const goalsSnapshot = await goalsCollectionRef.get();
      let goals = [];

      goalsSnapshot.forEach((doc) => {
        const goalData = doc.data();

        const goal = {
          id: doc.id,
          goalName: goalData.newGoal.goalName,
          goalDescription: goalData.newGoal.description,
          totalAmount: goalData.newGoal.totalAmount,
          dueDate: goalData.newGoal.dueDate || null,
          user_id: goalData.user_id,
          goal_id: goalData.goal_id,
          priority: goalData.newGoal.priority || 0
        };

        goals.push(goal);
      });

      // Do whatever you need with the fetched goals (e.g., set state)
      const sortedData = goals.sort((a, b) => {
        const priorityA = parseInt(a.priority);
        const priorityB = parseInt(b.priority);

        // If both priorities are 0 or both are non-zero, sort normally
        if (
          (priorityA === 0 && priorityB === 0) ||
          (priorityA !== 0 && priorityB !== 0)
        ) {
          return priorityA - priorityB;
        }

        // If one of them is 0, place the non-zero priority first
        return priorityA === 0 ? 1 : -1;
      });

      setAllGoals(sortedData);
      checkAndUpdateGoals(savingsAmount, allGoals);
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
      const achievementsSorted = achievements.sort((a, b) => {
        return new Date(b.achievedAt) - new Date(a.achievedAt);
      });
      setAllAchievements(achievementsSorted);
      // Do whatever you need with the fetched achievements (e.g., set state)
      console.log("achievments.length:", achievements.length);
      if (achievements.length > 0) {
        const sumAchievemnts = sumAchievemntsAmount(achievements);
        const savingsWithoutAchievements = totalIncome - totalOverallExpenses;
        setSavingsAmount(savingsWithoutAchievements - sumAchievemnts);
        dispatch(setSavingAmount(savingsWithoutAchievements - sumAchievemnts));
        const medal = getMedal(achievements.length);
        setUserLevel(medal);
      } else {
        dispatch(setSavingAmount(totalIncome - totalOverallExpenses));
        setSavingsAmount(totalIncome - totalOverallExpenses);
      }

      AsyncStorage.getItem("hasGivenReviews").then((hasGivenReviews) => {
        if (!hasGivenReviews || hasGivenReviews !== "true") {
          if (achievements.length > 3) {
            Alert.alert(
              "FeedBack",
              "Please give a feedback for improvements in application",
              [
                {
                  text: "OK",
                  onPress: async () => {
                    console.log("OK Pressed");
                    await AsyncStorage.setItem("hasGivenReviews", "true");
                    setModalVisible(true);
                  }
                },
                {
                  text: "Cancel",
                  onPress: async () => {
                    console.log("Cancel Pressed");
                    await AsyncStorage.setItem("hasGivenReviews", "true");
                  }
                }
              ]
            );
          }
        }
      });
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollection = firestore().collection("users");
        const userDocRef = usersCollection.doc(currentUser.uid);
        const userDocSnapshot = await userDocRef.get();
        if (userDocSnapshot.exists) {
          const userData = userDocSnapshot.data();

          if (userData) {
            dispatch(setUser(userData));
          }
        }
      } catch (error) {}
    };
    fetchUserData();
  }, []);

  const moveGoalToAchievemnt = async (selectedGoal) => {
    console.log("selectedGoal", selectedGoal);
    const goalsCollectionRef = firestore().collection(`users/${userId}/goals`);

    const querySnapshot = await goalsCollectionRef
      .where("goal_id", "==", selectedGoal.id)
      .get();
    querySnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    const achievementsCollectionRef = firestore().collection(
      `users/${userId}/achievements`
    );

    await achievementsCollectionRef.add({
      ...selectedGoal,
      achievedAt: new Date().toISOString(),
      isAchieved: true
    });
    console.log("here:1");
    await fetchExpenses();
    console.log("here:2");
    await fetchGoals();
    console.log("here:3");

    setIsCelebrationsDialogVisible(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCelebrationsDialogVisible(false);
    setIsCelebrationsVisible(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCelebrationsVisible(false);
  };

  const revertMoveGoalToAchievement = async (achievedGoal) => {
    setIsLoading(true);
    console.log("achievedGoal", achievedGoal);
    try {
      const achievementsCollectionRef = firestore().collection(
        `users/${userId}/achievements`
      );

      // Get the document reference based on the nested id
      const querySnapshot = await achievementsCollectionRef
        .where("id", "==", achievedGoal.id)
        .get();
      querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
      await fetchExpenses();
      await fetchGoals();
      const goalsCollectionRef = firestore().collection(
        `users/${userId}/goals`
      );
      const goal_id = uuid.v4();

      const goal = {
        user_id: userId,
        goal_id: goal_id,
        newGoal: {
          goalName: achievedGoal?.goalName,
          description: achievedGoal?.goalDescription,
          totalAmount: achievedGoal?.totalAmount,
          dueDate: achievedGoal?.dueDate,
          priority: achievedGoal?.priority ? achievedGoal?.priority : 0
        }
      };
      await goalsCollectionRef.add({
        isAchieved: false,
        ...goal,
        achievedAt: null // Assuming you have a field like achievedAt to mark when a goal was achieved
      });
      await fetchExpenses();
      await fetchGoals();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error in reverting goal to achievemnt", error);
    }
  };

  const checkAndUpdateGoals = async (savingsAmount, goals) => {
    try {
      if (goals?.length > 0) {
        const selectedGoal = goals[0];
        const isGoalAchieved = await isGoalMovedToAchievements(
          selectedGoal.goal_id
        );

        if (isGoalAchieved) {
          return;
        }

        if (savingsAmount >= selectedGoal.totalAmount) {
          setGoalAchieveable(selectedGoal);
          toast.show(
            `Congratulations ${selectedGoal.goalName} can now be achieved`,
            {
              type: "success",
              placement: "top",
              offset: 30,
              animationType: "zoom-in",
              duration: 3500
            }
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
      const achievementsSnapshot = await firestore()
        .collection(`users/${userId}/achievements`)
        .where("goal_id", "==", goalId)
        .get();
      return !achievementsSnapshot.empty;
    } catch (error) {
      console.error("Error checking if goal is moved to achievements:", error);
      return false;
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

  useEffect(() => {
    console.log("savingsAmount", savingsAmount);
    if (savingsAmount < 0) {
      revertMoveGoalToAchievement(AllAchievements[0]);
    }
  }, [savingsAmount]);

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
        />
      </View>

      <View style={styles.savingsContainer}>
        <Text style={styles.savingsText}>Savings Amount: </Text>
        <View style={styles.curvedBox}>
          <Text style={styles.currencySymbol}>{selectedCurrency.symbol}</Text>
          <Text style={styles.savingsAmountValue}>
            {savingsAmount.toFixed(1)}
          </Text>
        </View>
      </View>

      {allGoals.length > 0 ? (
        allGoals.map((goal) => {
          return (
            <View style={styles.currentGoalContainer} key={goal.id}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  onPress={() => {
                    console.log("isGoal:", isGoalAchieveable);
                  }}
                  style={styles.currentGoalText}
                ></Text>
                {isGoalAchieveable != null && allGoals[0].id == goal.id && (
                  <Button
                    onPress={() => {
                      moveGoalToAchievemnt(isGoalAchieveable);
                      setGoalAchieveable(null);
                    }}
                    title="Achieve"
                  />
                )}
              </View>

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
                      {selectedCurrency.symbol}
                      {goal.totalAmount}
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
                <View style={styles.goalDetailContainer}>
                  <Text style={styles.goalDetailLabel}>Priority:</Text>
                  <View style={styles.textbox}>
                    <Text style={styles.goalDetailValue}>{goal.priority}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          NO GOALS FOUND
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
      <ReviewModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        reviewText={reviewText}
        setReviewText={setReviewText}
        submitReview={submitReview}
      />
      <Loader isLoading={isLoading} />
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
    width: 150,
    flexDirection: "row"
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff"
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 7
  },
  savingsAmountValue: {
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
    alignItems: "center",
    justifyContent: "center",
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
