import React from 'react';
import { View, Text, TouchableOpacity, Menu, Provider , StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon library (optional)

const UserItem = ({ user, onOptionPress }) => {
  const [visible, setVisible] = React.useState(false);

  const handleMenuPress = (option) => {
    setVisible(false);
    onOptionPress(option, user.id); // Pass user ID for targeted actions
  };

  return (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{user.name}</Text>
      <Menu
        style={styles.menu}
        isVisible={visible}
        onDismiss={() => setVisible(false)}
        placement="right"
      >
        <Menu.Item onPress={() => handleMenuPress('Edit')} title="Edit User" />
        <Menu.Item onPress={() => handleMenuPress('Delete')} title="Delete User" />
        {/* Add more options as needed */}
      </Menu>
      <TouchableOpacity style={styles.dotsButton} onPress={() => setVisible(true)}>
        {<Icon name="more-vert" size={24} />} {/* Replace with your preferred icon */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 16,
  },
  menu: {
    // Customize menu styles here
  },
  dotsButton: {
    // Style the button containing the dots icon
  },
});

export default UserItem;
