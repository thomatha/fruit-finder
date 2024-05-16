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

export type FruitLocationReview = {
  id: number;
  user_id: string;
  tree_id: number;
  rating: number;
  review_text: string;
  created: string;
  user_img: string;
  user_name: string;
};

export type UserReview = {
    id: number;
    tree_id: number;
    user_id: string;
    rating: number;
    review_text: string;
}
