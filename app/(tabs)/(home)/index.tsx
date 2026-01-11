import { useRouter } from "expo-router";
import { FlatList, StyleSheet } from "react-native";
import { usePlantStore } from "../../../store/plantsStore";
import { PlantCard } from "../../../components/PlantCard";
import { ZelenkoButton } from "../../../components/ZelenkoButton";
import { theme } from "../../../theme";

export default function App() {
  const router = useRouter();
  const plants = usePlantStore((state) => state.plants);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={plants}
      renderItem={({ item }) => <PlantCard plant={item} />}
      ListEmptyComponent={
        <ZelenkoButton
          title="Dodaj svoju prvu biljku"
          onPress={() => {
            router.navigate("/new");
          }}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    padding: 12,
  },
});
