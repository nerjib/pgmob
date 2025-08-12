import { useLogout } from "@/hooks/useLogout";
import { Alert, Text, TouchableOpacity } from "react-native";

export default function LogoutScreen() {
const logout = useLogout();
  const handleLogout = () => {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: () => logout() },
        ],
        { cancelable: false }
      );
    };
  return <TouchableOpacity
            className="w-full bg-red-600 p-4 rounded-lg flex-row justify-center items-center"
            onPress={handleLogout}
          >
            <Text className="text-white text-lg font-semibold">Logout</Text>
          </TouchableOpacity>;
}
