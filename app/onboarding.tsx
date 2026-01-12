import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import { useRouter } from "expo-router";
import { useUserStore } from "../store/userStore";
import { ZelenkoButton } from "../components/ZelenkoButton";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ZelenkoImage } from "../components/ZelenkoImage";

export default function OnboardingScreen() {
  const router = useRouter();
  const toggleHasOnboarded = useUserStore((state) => state.toggleHasOnboarded);

  const handllePress = () => {
    toggleHasOnboarded();
    router.replace("/");
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={[theme.colorGreen, theme.colorAppleGreen, theme.colorLimeGreen]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View>
        <Text style={styles.heading}>Zelenko</Text>
        <Text style={styles.tagline}>
          Pobrinite se da vaši zeleni prijatelji uvek imaju dovoljno vode
        </Text>
      </View>
      <ZelenkoImage />
      <ZelenkoButton title="Pusti me unutra!" onPress={handllePress} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  heading: {
    fontSize: 42,
    color: theme.colorWhite,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
    fontFamily: "Nunito_400Regular",
  },
  tagline: {
    fontSize: 24,
    color: theme.colorWhite,
    textAlign: "center",
    paddingHorizontal: 10,
    fontFamily: "Nunito_400Regular",
  },
});
