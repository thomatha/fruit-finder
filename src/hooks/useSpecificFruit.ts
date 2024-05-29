import { type FruitLocationDetail } from '@/types';
import { useEffect, useState } from 'react';

type SpecificFruit = [FruitLocationDetail, (id: number) => void];

function useSpecificFruit(props): SpecificFruit {
  const [fruit, setFruit] = useState<FruitLocationDetail>();
  const [id, setId] = useState<number>(props ? props : 1);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setFruit(null);
        return;
      }
      const response = await fetch(`/api/fruit_locations?id=${id}`);
      const data = await response.json();
      // Re-map api data to FruitLocationDetail object
      if (!data || data.error) {
        setFruit(null);
        return;
      }
      const fruitData = data.map((item: any) => {
        const fruitLocationDetail: FruitLocationDetail = {
          id: item.id,
          fruit: item.fruit_name,
          fruit_id: item.fruit_id,
          name: item.fruit_tree_name,
          description: item.description,
          latitude: item.latitude,
          longitude: item.longitude,
          img_link: item.s3_img_link,
          user_id: item.user_id,
        };
        return fruitLocationDetail;
      });
      setFruit(fruitData[0]);
    };
    fetchData();
  }, [id]);

  const setBounds = (id: number) => {
    setId(id);
  };

  return [fruit, setBounds];
}

export default useSpecificFruit;
