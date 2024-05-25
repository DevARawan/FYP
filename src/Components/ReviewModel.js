import React from "react";
import { Modal, View, TextInput, Text, Button } from "react-native";

const ReviewModal = ({
  modalVisible,
  setModalVisible,
  reviewText,
  setReviewText,
  submitReview
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "80%"
          }}
        >
          <TextInput
            placeholder="Enter your review"
            value={reviewText}
            onChangeText={(text) => setReviewText(text)}
            multiline={true}
            maxLength={70}
            style={{
              height: 100,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10
            }}
          />
          <Text>{reviewText.length}/70</Text>
          <Button title="Submit" onPress={submitReview} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

export default ReviewModal;
