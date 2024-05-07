import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const AchievementsView = ({
  navigation,
  shareDialogVisible,
  setShareDialogVisible,
  achievements,
  shareAchievement
}) => {
  const renderAchievementItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.goalName}>{item.goalName}</Text>
        <TouchableOpacity onPress={() => setShareDialogVisible(true)}>
          <FontAwesome name="share-alt" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{item.goalDescription}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.row}>
          <Text style={styles.amount}>Total Amount: </Text>
          <Text>{item.totalAmount}</Text>
        </View>
        <Text style={styles.dueDate}>Due Date:{item.dueDate}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenHeading}>Achievements</Text>
      <FlatList
        data={achievements}
        renderItem={renderAchievementItem}
        contentContainerStyle={styles.flatListContent}
      />

      {shareDialogVisible && (
        <View style={styles.dialogOverlay}>
          <View style={styles.shareDialog}>
            <Text style={styles.dialogHeading}>Share on</Text>
            <View style={styles.platformIcons}>
              <TouchableOpacity
                onPress={() => Linking.openURL("https://www.facebook.com")}
                style={styles.iconContainer}
              >
                <FontAwesome name="facebook" size={40} color="#3b5998" />
                <Text style={styles.iconText}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL("https://www.twitter.com")}
                style={styles.iconContainer}
              >
                <FontAwesome name="twitter" size={40} color="#00acee" />
                <Text style={styles.iconText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => shareAchievement("Email")}
                style={styles.iconContainer}
              >
                <FontAwesome name="envelope" size={40} color="#808080" />
                <Text style={styles.iconText}>Email</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setShareDialogVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};
export default AchievementsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    marginHorizontal: 20
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  goalName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  description: {
    marginBottom: 10
  },
  flatListContent: {
    paddingBottom: 20
  },
  cardFooter: {
    flexDirection: "column",
    justifyContent: "space-between"
  },
  amount: {
    fontWeight: "bold"
  },
  row: {
    flexDirection: "row"
  },
  dueDate: {
    fontStyle: "italic"
  },
  dialogOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  shareDialog: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10
  },
  dialogHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  platformIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10
  },
  iconContainer: {
    alignItems: "center",
    margin: 10
  },
  iconText: {
    marginTop: 5
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 10
  },
  closeButtonText: {
    color: "blue"
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%"
  }
});
