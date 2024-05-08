import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

import { Alert } from "react-native";
import uuid from "react-native-uuid";
import { useSelector } from "react-redux";
import { useAuthContext } from "../../Hooks/UseAuth";

const ManageGoalsService = ({ children, navigation }) => {
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [allGoals, setAllGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState("");
  const [newGoal, setNewGoal] = useState({
    goalName: "",
    description: "",
    totalAmount: "",
    dueDate: ""
  });
  const [selectedGoal, setSelectedGoal] = useState();

  const selectedCurrency = useSelector((state) => state.currency.currency);

  const { currentUser } = useAuthContext();
  const userId = currentUser.uid;
  const handleDeleteGoal = (goalId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const userCollection = firestore().collection("users");
              const userDoc = userCollection.doc(userId);
              const goalsRef = userDoc.collection("goals");
              await goalsRef.doc(goalId).delete();
              // Refetch data after deletion
              fetchData();
            } catch (error) {
              console.error("Error deleting goal:", error);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setNewGoal({
      goalName: goal.goalName,
      description: goal.goalDescription,
      totalAmount: goal.totalAmount,
      dueDate: goal.dueDate || ""
    });
    setPriority(goal.priority);
    setShowAddGoal(true);
  };

  const fetchData = async () => {
    setIsLoading(true); // Set loading to true before fetching data
    try {
      const userCollection = firestore().collection("users");
      const userDoc = userCollection.doc(userId);
      const goalsRef = userDoc.collection("goals");
      const goalsSnapshot = await goalsRef.get();

      let goals = [];
      if (!goalsSnapshot.empty) {
        goalsSnapshot.forEach((doc) => {
          const goalData = doc.data();
          if (goalData.user_id === currentUser.uid) {
            goals.push({
              id: doc.id,
              goalName: goalData.newGoal.goalName,
              goalDescription: goalData.newGoal.description,
              totalAmount: goalData.newGoal.totalAmount,
              dueDate: goalData.newGoal.dueDate || null,
              priority: goalData.newGoal.priority || 0
            });
          }
        });
      }
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
      setIsLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setIsLoading(false); // Set loading to false if there's an error
      console.error("Error fetching user data:", error);
    }
  };

  const handlePriorityChange = (text) => {
    const priorityValue = parseInt(text);
    if (!isNaN(priorityValue) && priorityValue >= 1 && priorityValue <= 10) {
      setPriority(priorityValue.toString());
    } else {
      setPriority("");
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.goalName) {
      alert("Please enter a goal name.");
      return;
    }

    const totalAmountValid = /^[0-9]+(\.[0-9]+)?$/.test(newGoal.totalAmount);
    const priorityValid =
      priority === "" || // Allow empty string as the default value
      (!isNaN(parseInt(priority)) &&
        parseInt(priority) >= 1 &&
        parseInt(priority) <= 10);

    if (!totalAmountValid) {
      alert("Please enter a valid total amount.");
      return;
    }

    if (!priorityValid) {
      alert("Priority must be a number between 1 and 10.");
      return;
    }

    try {
      if (selectedGoal != null) {
        const userCollection = firestore().collection("users");
        const userDoc = userCollection.doc(userId);
        const goalsRef = userDoc.collection("goals");
        await goalsRef.doc(selectedGoal.id).update({
          newGoal: {
            ...newGoal,
            priority: priority
          }
        });
      } else {
        const goal_id = uuid.v4();
        const usersCollection = firestore().collection("users");
        const userDocRef = usersCollection.doc(userId);
        const goalsCollection = userDocRef.collection("goals");
        const goalsDocRef = goalsCollection.doc(goal_id);
        await goalsDocRef.set({
          newGoal: {
            ...newGoal,
            priority: priority
          },
          user_id: userId,
          goal_id
        });
      }

      setNewGoal({
        goalName: "",
        description: "",
        totalAmount: "",
        dueDate: ""
      });
      setSelectedGoal(null);
      setPriority("");
      fetchData();
      setShowAddGoal(false);
    } catch (error) {
      setNewGoal({
        goalName: "",
        description: "",
        totalAmount: "",
        dueDate: ""
      });
      setSelectedGoal(null);
      setPriority("");
      setShowAddGoal(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return children({
    navigation,
    showAddGoal,
    setShowAddGoal,
    allGoals,
    setAllGoals,
    isLoading,
    setIsLoading,
    open,
    setOpen,
    priority,
    setPriority,
    newGoal,
    setNewGoal,
    selectedGoal,
    setSelectedGoal,
    selectedCurrency,
    currentUser,
    userId,
    handleDeleteGoal,
    handleEditGoal,
    fetchData,
    handlePriorityChange,
    handleAddGoal
  });
};
export default ManageGoalsService;
