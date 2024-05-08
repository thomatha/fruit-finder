import { type FruitLocationDetail } from "@/types";
import { useEffect, useState } from "react";

type SpecificFruit = [
  FruitLocationDetail,
  (id: number) => void
];

function useSpecificFruit(): SpecificFruit {
  const [fruit, setFruit] = useState<FruitLocationDetail>();
  const [id, setId] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/fruit_locations?id=${id}`
      );
      const data = await response.json();
      console.log(data);
      // Re-map api data to FruitLocationDetail object
      const fruitData = data.map((item: any) => {
        const fruitLocationDetail: FruitLocationDetail = {
          id: item.id,
          fruit: item.fruit_name,
          name: item.fruit_tree_name,
          description: item.description,
          latitude: item.latitude,
          longitude: item.longitude,
          img_link: item.s3_img_link
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
