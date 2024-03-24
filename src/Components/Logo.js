import { Image, View } from 'react-native';

export const Logo = () => (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 1 }}>
      <Image
        source={require('../Images/mylogo.png')}
        style={{ width: 65, height: 61, borderRadius: 10, overflow: "hidden" }}
      />
    </View>
  );