import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { theme } from "../../../theme";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Zelenko",
          headerRight: () => (
            <Link href="/new" asChild>
              <Pressable
                hitSlop={8}
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.addButtonPressed,
                ]}
              >
                <Text style={styles.addButtonText}>Dodaj biljku</Text>
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="plants/[plantId]"
        options={{
          title: "",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Izmeni biljku",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: theme.colorLightGrey,
  },
  addButtonPressed: {
    backgroundColor: theme.colorAppleGreen,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colorGreen,
  },
});
