import FruitMap from "@/components/FruitMap";
import 'react-sliding-side-panel/lib/index.css';

const TOKEN = process.env.MAPBOX_TOKEN;

export default function Fruits() {
  return <FruitMap token={TOKEN} />;
}
