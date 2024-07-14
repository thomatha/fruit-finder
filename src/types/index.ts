export type FruitLocation = {
  id: number;
  fruit: string;
  latitude: number;
  longitude: number;
};

export type FruitLocationDetail = {
  id: number;
  name: string;
  description: string;
  fruit: string;
  fruit_id: number;
  latitude: number;
  longitude: number;
  img_link: string;
  user_id: string;
};

export type Fruit = {
  id: number;
  name: string;
};
