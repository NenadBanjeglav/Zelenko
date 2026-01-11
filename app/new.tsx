import { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  Alert,
  AlertButton,
  View,
  Pressable,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";
import { ZelenkoImage } from "../components/ZelenkoImage";
import { ZelenkoButton } from "../components/ZelenkoButton";
import { theme } from "../theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { usePlantStore } from "../store/plantsStore";
import { useRouter } from "expo-router";

export default function NewScreen() {
  const [name, setName] = useState<string>();
  const [days, setDays] = useState<string>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const addPlant = usePlantStore((state) => state.addPlant);
  const router = useRouter();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

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
      Alert.alert("Greška pri unosu", "Nije moguće sačuvati sliku.");
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
            { text: "Podešavanja", onPress: () => void Linking.openSettings() },
            { text: "Odustani", style: "cancel" },
          ];
      Alert.alert("Greška pri unosu", "Dozvoli pristup galeriji.", buttons);
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
            { text: "Podešavanja", onPress: () => void Linking.openSettings() },
            { text: "Odustani", style: "cancel" },
          ];
      Alert.alert("Greška pri unosu", "Dozvoli pristup kameri.", buttons);
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

  const handleSubmit = () => {
    if (!name) {
      return Alert.alert("Greška pri unosu", "Daj ime svom zelenom prijatelju");
    }

    if (!days) {
      return Alert.alert(
        "Greška pri unosu",
        `Koliko često treba zalivati ${name}?`,
      );
    }

    if (Number.isNaN(Number(days))) {
      return Alert.alert("Greška pri unosu", "Unesi broj dana za zalivanje");
    }

    addPlant(name, Number(days), imageUri ?? undefined);
    router.back();
  };

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
      </View>
      <Text style={styles.label}>Ime tvog zelenog prijatelja</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="npr. Kaktus Kasper"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Koliko Ž?esto se zaliva (svakih X dana)</Text>
      <TextInput
        value={days}
        onChangeText={setDays}
        style={styles.input}
        placeholder="npr. 6"
        keyboardType="number-pad"
      />
      <ZelenkoButton title="Dodaj zelenog prijatelja" onPress={handleSubmit} />
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
});
