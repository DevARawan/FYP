import firestore from "@react-native-firebase/firestore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useToast } from "react-native-toast-notifications";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { useAuthContext } from "../../Hooks/UseAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUser } from "../../Store/reducers/UserSlice";
import { getMedal } from "../../Utils/MedalUtils";
import { setSavingAmount } from "../../Store/reducers/SavingsSlice";

const HomeScreensBusinessLogic = ({ children }) => {
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

  const checkHasGivenReviews = async (userEmail) => {
    try {
      // Query the reviews collection to see if there is a review with the user's email
      const reviewQuerySnapshot = await firestore()
        .collection("reviews")
        .where("email", "==", userEmail)
        .get();

      // If there are any documents, the user has submitted a review
      if (!reviewQuerySnapshot.empty) {
        return true; // User has submitted a review
      } else {
        return false; // User has not submitted a review
      }
    } catch (error) {
      console.error("Error checking for user review:", error);
      throw error;
    }
  };

  const hasGivenReviewsOnFirestore = checkHasGivenReviews(currentUser.email);

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
        if (!hasGivenReviewsOnFirestore) {
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
    if (savingsAmount < 0) {
      revertMoveGoalToAchievement(AllAchievements[0]);
    }
  }, [savingsAmount]);

  return children({
    navigation,
    savingsAmount,
    setSavingsAmount,
    allGoals,
    setAllGoals,
    showCurrencyModal,
    setShowCurrencyModal,
    currentUser,
    isCelebrationsDialogVisible,
    setIsCelebrationsDialogVisible,
    isCelebrationsVisible,
    setIsCelebrationsVisible,
    AllAchievements,
    setAllAchievements,
    userLevel,
    setUserLevel,
    isGoalAchieveable,
    setGoalAchieveable,
    modalVisible,
    setModalVisible,
    dispatch,
    toast,
    reviewText,
    setReviewText,
    isLoading,
    setIsLoading,
    userId,
    submitReview,
    fetchExpenses,
    fetchGoals,
    sumAchievemntsAmount,
    checkHasGivenReviews,
    hasGivenReviewsOnFirestore,
    fetchAchievements,
    moveGoalToAchievemnt,
    revertMoveGoalToAchievement,
    checkAndUpdateGoals,
    isGoalMovedToAchievements,
    handleDataEntry,
    handleManageGoals,
    selectedCurrency
  });
};
export default HomeScreensBusinessLogic;
