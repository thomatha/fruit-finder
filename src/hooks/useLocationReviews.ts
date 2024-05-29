import { type FruitLocationReview } from '@/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type LocationReviews = [
  FruitLocationReview[],
  number,
  number,
  (id: number, refresh: boolean) => void,
];

function useLocationReviews(props): LocationReviews {
  const [reviews, setReviews] = useState<FruitLocationReview[]>();
  const [rating, setRating] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [id, setId] = useState<number>(props);
  const [forceRefresh, setForceRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviewData = async () => {
      const reviewResponse = await fetch(`/api/reviews?tree_id=${id}`);
      const data = await reviewResponse.json();

      // Handle a review error response
      if (!reviewResponse.ok) {
        toast.error('The was an error fetching location reviews.');
      } else {
        // Re-map api data to FruitLocationReview object
        const reviewData = data.map((item: any) => {
          const fruitReview: FruitLocationReview = {
            id: item.id,
            user_id: item.user_id,
            tree_id: item.tree_id,
            rating: item.rating,
            review_text: item.review_text,
            created: item.created,
            user_img: item.image,
            user_name: item.name,
          };
          var utc = new Date(fruitReview.created);
          var offset = utc.getTimezoneOffset();
          var local = new Date(utc.getTime() - offset * 60000);
          fruitReview.created = local.toLocaleString();
          return fruitReview;
        });
        setReviews(reviewData);
        const fetchRating = async () => {
          const ratingResponse = await fetch(
            `/api/reviews?tree_id=${id}&rating=${true}`,
          );
          const ratingData = await ratingResponse.json();

          // Handle a review error response
          if (!ratingResponse.ok) {
            toast.error('The was an error fetching location rating.');
          } else {
            if (ratingData) {
              let sum = ratingData[0].avgsum;
              let count = ratingData[0].avgcount;
              if (sum > 0 && count > 0) {
                let roundedAvg = Number(
                  (Math.round((sum / count) * 2) / 2).toFixed(1),
                );
                setRating(roundedAvg);
                setCount(count);
              } else {
                setRating(0);
                setCount(0);
              }
            }
          }
        };
        fetchRating();
      }
    };
    fetchReviewData();
  }, [id, forceRefresh]);

  const setBounds = (id: number, refresh: boolean) => {
    setId(id);
    setForceRefresh(refresh);
  };

  return [reviews, rating, count, setBounds];
}

export default useLocationReviews;
