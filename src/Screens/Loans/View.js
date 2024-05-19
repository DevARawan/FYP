import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Linking
} from "react-native";
import { useSelector } from "react-redux";

const LoansView = ({
  navigation,
  selectedCurrency,
  loanWebsites,
  renderItem,
  openWebsite
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          These are some websites where you can explore loan options:
        </Text>
      </View>
      <FlatList
        data={loanWebsites}
        renderItem={renderItem}
        keyExtractor={({ item, index }) => index}
      />
    </SafeAreaView>
  );
};
export default LoansView;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  instructions: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  instructionsText: {
    fontSize: 16,
    fontWeight: "bold"
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  },
  url: {
    fontSize: 14,
    color: "#666"
  }
});
