import { StyleSheet, Text, Pressable } from "react-native";
import { theme } from "../theme";
import * as Haptics from "expo-haptics";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export function ZelenkoButton({ title, onPress, variant = "primary" }: Props) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const isSecondary = variant === "secondary";
  const buttonStyle = isSecondary ? styles.buttonSecondary : styles.button;
  const pressedStyle = isSecondary
    ? styles.buttonSecondaryPressed
    : styles.buttonPressed;
  const textStyle = isSecondary ? styles.textSecondary : styles.text;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => {
        return pressed ? pressedStyle : buttonStyle;
      }}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: theme.colorGreen,
  },
  buttonPressed: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: theme.colorLeafyGreen,
  },
  buttonSecondary: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: theme.colorLightGrey,
  },
  buttonSecondaryPressed: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: theme.colorAppleGreen,
  },
  textSecondary: {
    color: theme.colorGreen,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
