import FruitMap from "@/components/FruitMap";
import 'react-sliding-side-panel/lib/index.css';
import { useSearchParams } from "next/navigation";

const TOKEN = process.env.MAPBOX_TOKEN;

export default function Fruits({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  
  return <FruitMap token={TOKEN} requestParams={searchParams} />;
}
