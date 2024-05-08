import { FontAwesome } from "@expo/vector-icons";

import { StyleSheet, View } from "react-native";

import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import DatePicker from "react-native-date-picker";
import Loader from "../../Utils/Loader";

const ManageGoalsView = ({
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
}) => {
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
            value={newGoal.goalName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) =>
              setNewGoal({ ...newGoal, description: text })
            }
            value={newGoal.description}
          />
          <View>
            <Text
              style={{
                position: "absolute",
                zIndex: 2,
                left: 15,
                height: "80%",
                textAlignVertical: "center"
              }}
            >
              {selectedCurrency.symbol}
            </Text>
            <TextInput
              style={[styles.input, { paddingLeft: 40 }]}
              placeholder="Total Amount"
              keyboardType="number-pad"
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setNewGoal({ ...newGoal, totalAmount: text });
                }
              }}
              value={newGoal.totalAmount}
            />
          </View>

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
            minimumDate={new Date()}
            mode="date"
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
                    {selectedCurrency.symbol} {goal.totalAmount}
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
                <TouchableOpacity
                  onPress={() => {
                    handleEditGoal(goal);
                  }}
                >
                  <FontAwesome
                    name="pencil"
                    size={32}
                    color="brown"
                    style={{ marginLeft: "10%", marginTop: 10 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleDeleteGoal(goal.id);
                  }}
                >
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
export default ManageGoalsView;

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
