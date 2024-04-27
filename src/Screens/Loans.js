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

export const Loans = () => {
  const selectedCurrency = useSelector((state) => state.currency.currency);
  const loanWebsites = selectedCurrency.websites;
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openWebsite(item.url)}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.url}>{item.url}</Text>
      </View>
    </TouchableOpacity>
  );

  const openWebsite = (url) => {
    if (Linking.canOpenURL(url)) {
      try {
        Linking.openURL(url);
      } catch (error) {
        console.log(error);
      }
    }

    // Implement website opening logic here
    // For example, you can use Linking from React Native to open the URL
    // See: https://reactnative.dev/docs/linking
  };

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
