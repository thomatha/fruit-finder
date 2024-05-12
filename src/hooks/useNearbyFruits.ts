import { type FruitLocation } from "@/types";
import { useEffect, useState } from "react";

type NearbyFruits = [
  FruitLocation[],
  (n: number, e: number, w: number, s: number, fruitFilter: number) => void
];

function useNearbyFruits(): NearbyFruits {
  const [fruits, setFruits] = useState<FruitLocation[]>([]);
  const [south, setSouth] = useState<number>(-90);
  const [north, setNorth] = useState<number>(90);
  const [west, setWest] = useState<number>(-180);
  const [east, setEast] = useState<number>(180);
  const [fruitFilter, setFruitFilter] = useState<number>(-1);

  // This useEffect with empty [] gets called once when the component is created
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/fruit_locations?east=${east}&west=${west}&north=${north}&south=${south}&fruit_id=${fruitFilter}`
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
  }, [east, north, south, west, fruitFilter]);

  const setBounds = (n: number, e: number, w: number, s: number, fruitFilter: number) => {
    setNorth(n);
    setEast(e);
    setWest(w);
    setSouth(s);
    setFruitFilter(fruitFilter);
  };

  return [fruits, setBounds];
}

export default useNearbyFruits;
