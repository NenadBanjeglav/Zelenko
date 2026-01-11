import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";

type Props = {
  size?: number;
  uri?: string | null;
};

export function ZelenkoImage({ size, uri }: Props) {
  const { width } = useWindowDimensions();

  const imageSize = size ?? Math.min(width / 1.5, 400);
  const source = uri ? { uri } : require("../assets/zelenko.png");

  return (
    <Image source={source} style={{ width: imageSize, height: imageSize }} />
  );
}
