import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";

const ReviewsView = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("reviews")
      .onSnapshot((snapshot) => {
        const reviewsData = [];
        snapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() });
        });
        setReviews(reviewsData);
      });

    return () => unsubscribe();
  }, []);

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.emailText}>{item.email}</Text>
      <Text style={styles.reviewText}>{item.review}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20
  },
  reviewContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5
  },
  reviewText: {
    fontSize: 16,
    marginBottom: 5
  }
});

export default ReviewsView;
