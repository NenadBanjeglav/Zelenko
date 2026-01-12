import { StyleSheet, View, Text, Pressable } from "react-native";
import { ZelenkoImage } from "./ZelenkoImage";
import { PlantType } from "../store/plantsStore";
import { theme } from "../theme";
import { Link } from "expo-router";
import { getSerbianDayLabel } from "../utils/serbian";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

type WateringStatus = {
  text: string;
  tone: "soon" | "due" | "overdue";
};

const getWateringStatus = (plant: PlantType): WateringStatus | null => {
  if (!plant.lastWateredAtTimestamp) {
    return { text: "💧 Vreme je za zalivanje", tone: "due" };
  }

  const lastWatered = new Date(plant.lastWateredAtTimestamp);
  const today = new Date();
  lastWatered.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysSince = Math.floor(
    (today.getTime() - lastWatered.getTime()) / MS_PER_DAY,
  );
  const remaining = plant.wateringFrequencyDays - daysSince;

  if (remaining < 0) {
    const overdueDays = Math.abs(remaining);
    const overdueLabel = getSerbianDayLabel(overdueDays);
    return {
      text: `🥵 Zedan! Kasnis ${overdueDays} ${overdueLabel}`,
      tone: "overdue",
    };
  }

  if (remaining === 0) {
    return { text: "💧 Vreme je za zalivanje", tone: "due" };
  }

  if (remaining === 1) {
    return { text: "⏳ Uskoro zalivanje", tone: "soon" };
  }

  return null;
};

export function PlantCard({ plant }: { plant: PlantType }) {
  const dayLabel = getSerbianDayLabel(plant.wateringFrequencyDays);
  const wateringText =
    plant.wateringFrequencyDays === 1
      ? "Zalivaj svaki dan"
      : `Zalivaj na svakih ${plant.wateringFrequencyDays} ${dayLabel}`;
  const status = getWateringStatus(plant);

  return (
    <Link href={`plants/${plant.id}`} asChild>
      <Pressable style={styles.plantCard}>
        <ZelenkoImage size={100} uri={plant.imageUri} />
        <View style={styles.details}>
          <Text numberOfLines={1} style={styles.plantName}>
            {plant.name}
          </Text>
          <Text style={styles.subtitle}>{wateringText}</Text>
          {status ? (
            <Text
              style={[
                styles.status,
                status.tone === "soon"
                  ? styles.statusSoon
                  : status.tone === "due"
                    ? styles.statusDue
                    : styles.statusOverdue,
              ]}
            >
              {status.text}
            </Text>
          ) : null}
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
  status: {
    marginTop: 4,
    fontSize: 14,
  },
  statusSoon: {
    color: theme.colorGrey,
  },
  statusDue: {
    color: theme.colorGreen,
  },
  statusOverdue: {
    color: theme.colorBlack,
  },
});
