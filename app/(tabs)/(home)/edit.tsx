import { useEffect, useState } from "react";
import {
  Alert,
  AlertButton,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ZelenkoImage } from "../../../components/ZelenkoImage";
import { ZelenkoButton } from "../../../components/ZelenkoButton";
import { theme } from "../../../theme";
import { usePlantStore } from "../../../store/plantsStore";

export default function EditPlantScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ plantId?: string | string[] }>();
  const plantId = Array.isArray(params.plantId)
    ? params.plantId[0]
    : params.plantId;
  const plant = usePlantStore((state) =>
    state.plants.find((plantItem) => plantItem.id === plantId),
  );
  const updatePlant = usePlantStore((state) => state.updatePlant);

  const [name, setName] = useState<string>();
  const [days, setDays] = useState<string>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  useEffect(() => {
    if (!plant) {
      return;
    }

    setName(plant.name);
    setDays(String(plant.wateringFrequencyDays));
    setImageUri(plant.imageUri ?? null);
  }, [plant]);

  const imagePickerOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  };

  const persistImage = async (uri: string) => {
    try {
      const imagesDirectory = new Directory(Paths.document, "plant-images");
      imagesDirectory.create({ intermediates: true, idempotent: true });

      const extension = uri.split(".").pop()?.split("?")[0] ?? "jpg";
      const fileName = `plant-${Date.now()}.${extension}`;
      const destination = new File(imagesDirectory, fileName);

      const source = new File(uri);
      source.copy(destination);
      return destination.uri;
    } catch {
      Alert.alert("Greska pri unosu", "Nije moguce sacuvati sliku.");
      return uri;
    }
  };

  const pickFromLibrary = async () => {
    const permission = mediaLibraryPermission?.granted
      ? mediaLibraryPermission
      : mediaLibraryPermission?.canAskAgain === false
        ? mediaLibraryPermission
        : await requestMediaLibraryPermission();
    if (!permission?.granted) {
      const buttons: AlertButton[] = permission?.canAskAgain
        ? [{ text: "U redu" }]
        : [
            { text: "Podesavanja", onPress: () => void Linking.openSettings() },
            { text: "Odustani", style: "cancel" },
          ];
      Alert.alert("Greska pri unosu", "Dozvoli pristup galeriji.", buttons);
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
    if (!result.canceled) {
      const storedUri = await persistImage(result.assets[0].uri);
      setImageUri(storedUri);
    }
  };

  const takePhoto = async () => {
    const permission = cameraPermission?.granted
      ? cameraPermission
      : cameraPermission?.canAskAgain === false
        ? cameraPermission
        : await requestCameraPermission();
    if (!permission?.granted) {
      const buttons: AlertButton[] = permission?.canAskAgain
        ? [{ text: "U redu" }]
        : [
            { text: "Podesavanja", onPress: () => void Linking.openSettings() },
            { text: "Odustani", style: "cancel" },
          ];
      Alert.alert("Greska pri unosu", "Dozvoli pristup kameri.", buttons);
      return;
    }

    const result = await ImagePicker.launchCameraAsync(imagePickerOptions);
    if (!result.canceled) {
      const storedUri = await persistImage(result.assets[0].uri);
      setImageUri(storedUri);
    }
  };

  const handlePickImage = () => {
    Alert.alert(
      "Odaberi sliku",
      "Izaberi izvor slike",
      [
        { text: "Galerija", onPress: () => void pickFromLibrary() },
        { text: "Kamera", onPress: () => void takePhoto() },
        { text: "Odustani", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleSubmit = () => {
    if (!plant) {
      return;
    }

    const trimmedName = name?.trim();
    if (!trimmedName) {
      return Alert.alert("Greska pri unosu", "Daj ime svom zelenom prijatelju");
    }

    if (!days) {
      return Alert.alert(
        "Greska pri unosu",
        `Koliko cesto treba zalivati ${trimmedName}?`,
      );
    }

    if (Number.isNaN(Number(days))) {
      return Alert.alert("Greska pri unosu", "Unesi broj dana za zalivanje");
    }

    updatePlant(plant.id, {
      name: trimmedName,
      wateringFrequencyDays: Number(days),
      imageUri,
    });
    router.back();
  };

  if (!plant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Biljka nije pronadjena.</Text>
        <View style={styles.spacer} />
        <ZelenkoButton title="Nazad" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      extraScrollHeight={24}
      keyboardOpeningTime={0}
    >
      <View style={styles.centered}>
        <Pressable onPress={handlePickImage} style={styles.imagePicker}>
          <ZelenkoImage uri={imageUri} />
          <Text style={styles.imageHint}>
            {imageUri ? "Promeni sliku" : "Dodaj sliku"}
          </Text>
        </Pressable>
        {imageUri ? (
          <Pressable onPress={handleRemoveImage} style={styles.removeImage}>
            <Text style={styles.removeImageText}>Ukloni sliku</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.label}>Ime tvog zelenog prijatelja</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="npr. Kaktus Kasper"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Koliko cesto se zaliva (svakih X dana)</Text>
      <TextInput
        value={days}
        onChangeText={setDays}
        style={styles.input}
        placeholder="npr. 6"
        keyboardType="number-pad"
      />
      <ZelenkoButton title="Sacuvaj izmene" onPress={handleSubmit} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  input: {
    borderWidth: 2,
    borderColor: theme.colorLightGrey,
    padding: 12,
    borderRadius: 6,
    marginBottom: 24,
    fontSize: 18,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  centered: {
    alignItems: "center",
  },
  imagePicker: {
    alignItems: "center",
  },
  imageHint: {
    marginTop: 8,
    color: theme.colorGrey,
    fontSize: 14,
  },
  removeImage: {
    marginTop: 8,
    padding: 8,
  },
  removeImageText: {
    color: theme.colorGrey,
    fontSize: 14,
  },
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
  spacer: {
    height: 18,
  },
});
