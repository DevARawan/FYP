import React from "react";
import {
  Modal,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity
} from "react-native";
import currencyList from "./CurrenciesList"; // assuming you have the currency list object
import { useDispatch } from "react-redux";
import { setCurrency } from "../Store/reducers/currenncyReducer";
import { updateUserCurrency } from "./currencyFirebaseHandler";
import firestore from "@react-native-firebase/firestore";
import { useAuthContext } from "../Hooks/UseAuth";
const CurrencySelectionModal = ({ visible, onClose }) => {
  const { currentUser } = useAuthContext();
  const dispatch = useDispatch();
  const handleSetCurrency = async (currencyCode) => {
    dispatch(setCurrency(currencyCode)); // Update Redux state
    await firestore().collection("users").doc(currentUser.uid).update({
      currency: currencyCode
    });
    onClose();
  };

  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSetCurrency(item)}>
      <View style={{ padding: 10 }}>
        <Text>{`${item.name} (${item.symbol})`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
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
          <Text>Select Your Preferred Currency</Text>
          <FlatList
            data={Object.keys(currencyList).map((currencyCode) => ({
              code: currencyCode,
              ...currencyList[currencyCode]
            }))}
            renderItem={renderCurrencyItem}
            keyExtractor={(item) => item.code}
            style={{ maxHeight: 300 }}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default CurrencySelectionModal;
