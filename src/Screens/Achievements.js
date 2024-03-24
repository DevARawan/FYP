import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Linking, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const Achievements = () => {
  const [shareDialogVisible, setShareDialogVisible] = useState(false);
  const [starsAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(starsAnimation, {
        toValue: 1,
        duration: 20000, // Adjust duration as needed
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shareAchievement = (platform) => {
    // Logic to open respective platform for sharing
    switch (platform) {
      case 'Facebook':
        // Open Facebook sharing screen (placeholder)
        openFacebook();
        break;
      case 'Twitter':
        // Open Twitter sharing screen (placeholder)
        openTwitter();
        break;
      case 'Email':
        // Open email app with a prefilled message (placeholder)
        openEmail();
        break;
      default:
        break;
    }
    setShareDialogVisible(false); // Close the share dialog after handling
  };

  const openFacebook = () => {
    // Placeholder for opening Facebook sharing screen
    // You can integrate with Facebook SDK or use deep linking if available
    Alert.alert('Opening Facebook for sharing...');
  };

  const openTwitter = () => {
    // Placeholder for opening Twitter sharing screen
    // You can integrate with Twitter SDK or use deep linking if available
    Alert.alert('Opening Twitter for sharing...');
  };

  const openEmail = () => {
    // Placeholder for opening email app with a prefilled message
    // You can use the `Linking` API to open email apps
    Linking.openURL('mailto:?subject=Check%20out%20my%20achievement&body=I%20have%20achieved%20something%20great!');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.starsContainer, { transform: [{ translateY: starsAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -500], // Adjust the range as needed
        }) }] }]}>
        <FontAwesome name="star" size={20} color="#ffd700" style={{ position: 'absolute', top: 100, left: 50 }} />
        <FontAwesome name="star" size={20} color="#ffd700" style={{ position: 'absolute', top: 200, left: 150 }} />
        {/* Add more stars as needed */}
      </Animated.View>
      <LottieView style={{width:200, height:150, alignSelf:'center', marginBottom:7}}
        source={require('F:\React-Native-EXPO\FYP\Animations\Achievement - 1710619590056.json')} autoPlay loop 
        />

      <Text style={styles.screenHeading}>Achievements</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.goalName}>Iphone15 pro max</Text>
          <TouchableOpacity onPress={() => setShareDialogVisible(true)}>
            <FontAwesome name="share-alt" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>my dream mobile phone with fantastic features and it is more secure.</Text>
        <View style={styles.cardFooter}>
            <View style={styles.row}>
          <Text style={styles.amount}>Total Amount: </Text>
          <Text>250 000</Text>
          </View>
          <Text style={styles.dueDate}>Due Date: 10-5-2024</Text>
        </View>
      </View>

      {/* Share Dialog */}
      {shareDialogVisible && (
        <View style={styles.dialogOverlay}>
          <View style={styles.shareDialog}>
            <Text style={styles.dialogHeading}>Share on</Text>
            <View style={styles.platformIcons}>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com')} style={styles.iconContainer}>
  <FontAwesome name="facebook" size={40} color="#3b5998" />
  <Text style={styles.iconText}>Facebook</Text>
</TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://www.twitter.com')} style={styles.iconContainer}>
                <FontAwesome name="twitter" size={40} color="#00acee" />
                <Text style={styles.iconText}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => shareAchievement('Email')} style={styles.iconContainer}>
                <FontAwesome name="envelope" size={40} color="#808080" />
                <Text style={styles.iconText}>Email</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setShareDialogVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  amount: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection:'row',
  },
  dueDate: {
    fontStyle: 'italic',
  },
  dialogOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareDialog: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
  },
  dialogHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  platformIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  iconContainer: {
    alignItems: 'center',
    margin: 10,
  },
  iconText: {
    marginTop: 5,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'blue',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default Achievements;
