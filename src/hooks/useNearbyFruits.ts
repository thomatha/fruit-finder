import { type FruitLocation } from "@/types";
import { useEffect, useState } from "react";

function useNearbyFruits() {
  const [fruits, setFruits] = useState<FruitLocation[]>([]);

  // TODO set map bounds
  // This useEffect with empty [] gets called once when the component is created
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "/api/fruit_locations?east=180&west=-180&north=90&south=-90"
      );
      const data = await response.json();

      // Re-map api data to FruitLocation object
      const fruitData = data.map((item: any) => {
        const fruitLocation: FruitLocation = {
          id: item.id,
          fruit: item.fruit_name,
          latitude: item.latitude,
          longitude: item.longitude,
        };
        return fruitLocation;
      });
      setFruits(fruitData);
    };
    fetchData();
  }, []);

  return [fruits];
}

export default useNearbyFruits;
