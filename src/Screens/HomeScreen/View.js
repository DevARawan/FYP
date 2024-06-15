import LottieView from "lottie-react-native";
import React from "react";
import {
  Button,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { CircularProgressBar } from "../Components/CircularProgressBar";
import ReviewModal from "../Components/ReviewModel";
import CurrencySelectionModal from "../Utils/CurrencySelectionModal";
import Loader from "../Utils/Loader";

const HomeScreenView = ({
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
  navigation,
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
}) => {
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
export default HomeScreenView;

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
