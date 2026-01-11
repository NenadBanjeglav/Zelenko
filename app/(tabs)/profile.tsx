import { StyleSheet, View } from "react-native";
import { theme } from "../../theme";
import { ZelenkoButton } from "../../components/ZelenkoButton";
import { useRouter } from "expo-router";
import { useUserStore } from "../../store/userStore";

export default function ProfileScreen() {
  const router = useRouter();
  const toggleHasOnboarded = useUserStore((state) => state.toggleHasOnboarded);

  const handlePress = () => {
    toggleHasOnboarded();
    router.replace("/onboarding");
  };
  return (
    <View style={styles.container}>
      <ZelenkoButton title="Nazad na onboarding" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colorWhite,
  },
});
