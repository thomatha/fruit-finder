import { Fruit, type FruitLocation } from "@/types";
import { useEffect, useState } from "react";

type NearbyFruits = [
  FruitLocation[],
  (n: number, e: number, w: number, s: number) => void,
  (filter: Fruit) => void,
  Fruit
];

function useNearbyFruits(): NearbyFruits {
  const [fruits, setFruits] = useState<FruitLocation[]>([]);
  const [south, setSouth] = useState<number>(-90);
  const [north, setNorth] = useState<number>(90);
  const [west, setWest] = useState<number>(-180);
  const [east, setEast] = useState<number>(180);
  const [filter, setFilter] = useState<Fruit>();

  // This useEffect with empty [] gets called once when the component is created
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/fruit_locations?east=${east}&west=${west}&north=${north}&south=${south}`
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
  }, [east, north, south, west]);

  const setBounds = (n: number, e: number, w: number, s: number) => {
    setNorth(n);
    setEast(e);
    setWest(w);
    setSouth(s);
  };

  // If there is a filter, return filtered list of fruit locations, else all
  const filteredFruit = filter
    ? fruits.filter((item: FruitLocation) => item.fruit === filter.name)
    : fruits;
  return [filteredFruit, setBounds, setFilter, filter];
}

export default useNearbyFruits;
