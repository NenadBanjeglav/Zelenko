import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { usePlantStore } from "../../../../store/plantsStore";
import { ZelenkoButton } from "../../../../components/ZelenkoButton";
import { theme } from "../../../../theme";
import { ZelenkoImage } from "../../../../components/ZelenkoImage";
import { getSerbianDayLabel } from "../../../../utils/serbian";

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "maj",
  "jun",
  "jul",
  "avg",
  "sep",
  "okt",
  "nov",
  "dec",
];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatFullDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}. ${month} ${year}. ${hours}:${minutes}`;
};

const getDaysSince = (timestamp: number) => {
  const start = new Date(timestamp);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / MS_PER_DAY);
};

export default function PlantDetails() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ plantId?: string | string[] }>();
  const plantId = Array.isArray(params.plantId)
    ? params.plantId[0]
    : params.plantId;
  const waterPlant = usePlantStore((store) => store.waterPlant);
  const removePlant = usePlantStore((store) => store.removePlant);
  const plant = usePlantStore((state) =>
    state.plants.find((plantItem) => plantItem.id === plantId),
  );

  useEffect(() => {
    if (plant?.name) {
      navigation.setOptions({ title: plant.name });
    }
  }, [plant?.name, navigation]);

  const handleWaterPlant = () => {
    if (plantId) {
      waterPlant(plantId);
    }
  };

  const handleDeletePlant = () => {
    if (!plant?.id) {
      return;
    }

    Alert.alert(
      `Obriši ${plant.name}?`,
      "Ova radnja se ne može opozvati.",
      [
        {
          text: "Obriši",
          onPress: () => {
            removePlant(plant.id);
            router.navigate("/");
          },
          style: "destructive",
        },
        { text: "Otkaži", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  const handleEditPlant = () => {
    if (!plant?.id) {
      return;
    }

    router.navigate({
      pathname: "/edit",
      params: { plantId: plant.id },
    });
  };

  if (!plant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Biljka nije pronađena.</Text>
        <View style={styles.spacer} />
        <ZelenkoButton
          title="Nazad na listu"
          onPress={() => router.navigate("/")}
        />
      </View>
    );
  }

  const lastWateredText = plant.lastWateredAtTimestamp
    ? formatFullDate(plant.lastWateredAtTimestamp)
    : "Nikad";
  const daysSince = plant.lastWateredAtTimestamp
    ? getDaysSince(plant.lastWateredAtTimestamp)
    : "N/A";
  const wateringDaysLabel = getSerbianDayLabel(plant.wateringFrequencyDays);

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.centered}>
        <ZelenkoImage uri={plant.imageUri} />
        <View style={styles.spacer} />
        <Text style={styles.key}>Zalivaj me na svakih</Text>
        <Text style={styles.value}>
          {plant.wateringFrequencyDays} {wateringDaysLabel}
        </Text>
        <Text style={styles.key}>Poslednje zalivanje</Text>
        <Text style={styles.value}>{lastWateredText}</Text>
        <Text style={styles.key}>Dana od poslednjeg zalivanja</Text>
        <Text style={styles.value}>{daysSince}</Text>
      </View>
      <ZelenkoButton
        title="Izmeni biljku"
        onPress={handleEditPlant}
        variant="secondary"
      />
      <View style={styles.spacer} />
      <ZelenkoButton title="Zalij me!" onPress={handleWaterPlant} />

      <Pressable style={styles.deleteButton} onPress={handleDeletePlant}>
        <Text style={styles.deleteButtonText}>Obriši</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
  },
  detailsContainer: {
    padding: 12,
    backgroundColor: theme.colorWhite,
    flex: 1,
    justifyContent: "center",
  },
  centered: {
    alignItems: "center",
  },
  key: {
    marginRight: 8,
    fontSize: 16,
    color: theme.colorBlack,
    textAlign: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: theme.colorGreen,
  },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: theme.colorGrey,
    fontWeight: "bold",
  },
  spacer: {
    height: 18,
  },
});
