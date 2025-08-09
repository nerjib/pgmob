
import { StyleSheet, Text, View } from 'react-native';

export default function DevicesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Devices</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
