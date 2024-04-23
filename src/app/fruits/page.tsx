import FruitMap from "@/components/FruitMap";

const TOKEN = process.env.MAPBOX_TOKEN;

export default function Fruits() {
  return <FruitMap token={TOKEN} />;
}
