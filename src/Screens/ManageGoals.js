import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  doc,
  getDoc,
  getFirestore,
  collection,
  setDoc,
  getDocs
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import uuid from "react-native-uuid";

let controlRender = true;

const ManageGoals = () => {
  const app = FIREBASE_APP;
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [allGoals, setAllGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const db = getFirestore(app);
  let goals = [];
  const [newGoal, setNewGoal] = useState({
    goalName: "",
    description: "",
    totalAmount: "",
    dueDate: ""
  });

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
            dueDate: goalData.newGoal.dueDate || null
          });
        }
      });
      setAllGoals(goals);
      setIsLoading(false);
      // Do whatever you need with goalsData here
    } catch (error) {
      console.error("Error fetching user data 3:", error);
    }
  };

  const handleAddGoal = async () => {
    try {
      const goal_id = uuid.v4();
      const user = await AsyncStorage.getItem("user");
      const userId = JSON.parse(user)?.user?.uid;
      const db = getFirestore(app);
      const usersCollection = collection(db, "users");
      const userDocRef = doc(usersCollection, userId);
      const goalsCollection = collection(userDocRef, "goals");
      const goalsDocRef = doc(goalsCollection, goal_id);

      setDoc(goalsDocRef, {
        newGoal,
        user_id: userId,
        goal_id
      });
      setNewGoal({
        goalName: "",
        description: "",
        totalAmount: "",
        dueDate: ""
      });
      fetchData();
      controlRender = true;
      setShowAddGoal(false);
    } catch (error) {
      setShowAddGoal(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showMessage = (message) => {
    // Show message in a modal
    setModalVisible(true);
    // Set message to display
    setMessage(message);
  };
  // if (date != null) {
  //   if (controlRender) {
  //     setNewGoal({ ...newGoal, dueDate: date });
  //     controlRender = false;
  //   }
  // }

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

      {/* Existing Goals Section */}
      <ScrollView style={styles.goalsContainer}>
        {showAddGoal && (
          <View style={styles.goalBox}>
            <View style={styles.goalDetailContainer}>
              <Text style={styles.goalDetailLabel}>Goal Name:</Text>
              <View style={styles.textbox}>
                <Text style={styles.goalDetailValue}>{newGoal.goalName}</Text>
              </View>
            </View>
            <View style={styles.goalDetailContainer}>
              <Text style={styles.goalDetailLabel}>Description:</Text>
              <View style={styles.textbox}>
                <Text style={styles.goalDetailValue}>
                  {newGoal.description}
                </Text>
              </View>
            </View>
            <View style={styles.goalDetailContainer}>
              <Text style={styles.goalDetailLabel}>Total Amount:</Text>
              <View style={styles.textbox}>
                <Text style={styles.goalDetailValue}>
                  {newGoal.totalAmount}
                </Text>
              </View>
            </View>
            <View style={styles.goalDetailContainer}>
              <Text style={styles.goalDetailLabel}>Due Date:</Text>
              <View style={styles.textbox}>
                <Text style={styles.goalDetailValue}>
                  {newGoal.dueDate == "" ? "No Due Date" : newGoal.dueDate}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Goal Section */}

      {/* Add Goal Form (Conditional Rendering) */}
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
            onChangeText={(text) =>
              setNewGoal({ ...newGoal, totalAmount: text })
            }
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Due Date (Optional)"
            onChangeText={(text) => setNewGoal({ ...newGoal, dueDate: text })}
          /> */}
          <TouchableOpacity
            style={styles.input}
            placeholder="Due Date (Optional)"
            onPress={() => {
              setOpen(true);
            }}
            onChangeText={(text) => setNewGoal({ ...newGoal, dueDate: text })}
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
                dueDate: JSON.stringify(moment(date).format("l"))
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
          size="extraLarge"
          color="#0000ff"
        />
      ) : allGoals.length > 0 ? (
        allGoals.map((goal) => (
          <View style={styles.goalsContainer} key={goal.id}>
            {/* <Text style={styles.currentGoalText}>Current Goal</Text> */}
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
