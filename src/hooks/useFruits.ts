import { type Fruit } from '@/types';
import { useEffect, useState } from 'react';

// This is the hook return type
type FruitsData = [Fruit[], boolean];

function useFruits(): FruitsData {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);

  // This useEffect with empty [] gets called once when the component is created
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/fruits');
      const data = await response.json();

      // Re-map api data to Fruit object
      const fruitData = data
        .map((item: any) => {
          const fruit: Fruit = {
            id: item.fruit_id,
            name: item.fruit_name,
          };
          return fruit;
        })
        .sort((a: Fruit, b: Fruit) => a.name.localeCompare(b.name));

      setFruits(fruitData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return [fruits, loading];
}

export default useFruits;
