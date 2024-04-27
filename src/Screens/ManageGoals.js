import { FontAwesome } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DatePicker from "react-native-date-picker";
import uuid from "react-native-uuid";
import { useAuthContext } from "../Hooks/UseAuth";
import Loader from "../Utils/Loader";

const ManageGoals = () => {
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

  const { currentUser } = useAuthContext();
  const userId = currentUser.uid;

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
              priority: goalData.newGoal.priority || ""
            });
          }
        });
      }

      setAllGoals(goals);
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
      !isNaN(parseInt(priority)) &&
      parseInt(priority) >= 1 &&
      parseInt(priority) <= 10;

    if (!totalAmountValid) {
      alert("Please enter a valid total amount.");
      return;
    }

    if (!priorityValid) {
      alert("Priority must be a number between 1 and 10.");
      return;
    }

    try {
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

      setNewGoal({
        goalName: "",
        description: "",
        totalAmount: "",
        dueDate: ""
      });
      setPriority("");
      fetchData();
      setShowAddGoal(false);
    } catch (error) {
      setShowAddGoal(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.allGoals}>
        <Text style={styles.heading}>All Goals</Text>
        <TouchableOpacity
          style={styles.addGoalButton}
          onPress={() => setShowAddGoal(true)}
        >
          <Text style={styles.buttonText}>Add Goal</Text>
        </TouchableOpacity>
      </View>

      {showAddGoal && (
        <View style={styles.addGoalForm}>
          <TextInput
            style={styles.input}
            placeholder="Goal Name"
            onChangeText={(text) => setNewGoal({ ...newGoal, goalName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) =>
              setNewGoal({ ...newGoal, description: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Total Amount"
            keyboardType="number-pad"
            onChangeText={(text) =>
              setNewGoal({ ...newGoal, totalAmount: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Priority (1-10)"
            keyboardType="number-pad"
            onChangeText={handlePriorityChange}
            value={priority}
          />
          <TouchableOpacity
            style={styles.input}
            placeholder="Due Date (Optional)"
            onPress={() => setOpen(true)}
          >
            <Text>
              {newGoal.dueDate == "" ? "Due Date (Optional)" : newGoal.dueDate}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>

          <DatePicker
            modal
            open={open}
            date={new Date()}
            onConfirm={(date) => {
              setOpen(false);
              setNewGoal({
                ...newGoal,
                dueDate: date.toISOString().split("T")[0]
              });
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="#0000ff"
        />
      ) : allGoals.length > 0 ? (
        allGoals.map((goal) => (
          <View style={styles.goalsContainer} key={goal.id}>
            <View style={styles.goalBox}>
              <View style={styles.goalDetailContainer}>
                <Text style={styles.goalDetailLabel}>Goal Name:</Text>
                <View style={styles.textbox}>
                  <Text style={styles.goalDetailValue}>{goal.goalName}</Text>
                </View>
              </View>

              <View style={styles.goalDetailContainer}>
                <Text style={styles.goalDetailLabel}>Priority:</Text>
                <View style={styles.textbox}>
                  <Text style={styles.goalDetailValue}>{goal.priority}</Text>
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
                    {goal.dueDate == null ? "No Due Date" : goal.dueDate}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <TouchableOpacity>
                  <FontAwesome
                    name="pencil"
                    size={32}
                    color="brown"
                    style={{ marginLeft: "10%", marginTop: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <FontAwesome
                    name="trash"
                    size={32}
                    color="brown"
                    style={{ marginRight: 10, marginTop: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No goals found.
        </Text>
      )}
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
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 10,
    textAlign: "center"
  },
  goalsContainer: {
    marginBottom: 20
  },
  goalBox: {
    backgroundColor: "lightgrey",
    borderRadius: 15,
    padding: 15,
    marginTop: 10
  },
  goalBoxText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5
  },
  goalDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14
  },
  addGoalButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  goalDetailLabel: {
    fontSize: 16,
    marginRight: 5,
    width: 100
  },
  addGoalForm: {
    backgroundColor: "#ecf0f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  textbox: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 9,
    flex: 1
  },
  goalDetailValue: {
    fontSize: 16,
    fontWeight: "500"
  },
  allGoals: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default ManageGoals;
