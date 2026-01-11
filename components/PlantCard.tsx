import { StyleSheet, View, Text, Pressable } from "react-native";
import { ZelenkoImage } from "./ZelenkoImage";
import { PlantType } from "../store/plantsStore";
import { theme } from "../theme";
import { Link } from "expo-router";
import { getSerbianDayLabel } from "../utils/serbian";

export function PlantCard({ plant }: { plant: PlantType }) {
  const dayLabel = getSerbianDayLabel(plant.wateringFrequencyDays);
  const wateringText =
    plant.wateringFrequencyDays === 1
      ? "Zalivaj svaki dan"
      : `Zalivaj na svakih ${plant.wateringFrequencyDays} ${dayLabel}`;

  return (
    <Link href={`plants/${plant.id}`} asChild>
      <Pressable style={styles.plantCard}>
        <ZelenkoImage size={100} uri={plant.imageUri} />
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.plantName}>
            {plant.name}
          </Text>
          <Text style={styles.subtitle}>{wateringText}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  plantCard: {
    flexDirection: "row",
    shadowColor: theme.colorBlack,
    backgroundColor: theme.colorWhite,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  details: {
    padding: 14,
    justifyContent: "center",
  },
  plantName: {
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colorGrey,
  },
});
