import { Fruit } from '@/types';
import { PutBlobResult } from '@vercel/blob';
import { useState } from 'react';

// This is the hook return type
type AddFruitData = [
  (
    fruit: Fruit,
    latitude: number,
    longitude: number,
    notes: string,
    file: File,
    user_id: string,
  ) => void,
  boolean,
  boolean,
];

export default function useAddFruit(): AddFruitData {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function addFruit(
    fruit: Fruit,
    latitude: number,
    longitude: number,
    notes: string,
    file: File,
    user_id: string,
  ): Promise<void> {
    setSaving(true);

    let s3_img_link = null;
    try {
      if (file) {
        const response = await fetch('/api/images', {
          method: 'POST',
          body: file,
        });

        if (response.ok) {
          const newBlob = (await response.json()) as PutBlobResult;
          s3_img_link = newBlob.url;
          console.log(newBlob);
        } else {
          console.error('Failed to get pre-signed URL.');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      // TODO const s3_img_link = await uploadImage(file);

      const data = {
        name: fruit.name,
        fruit_id: fruit.id,
        latitude,
        longitude,
        description: notes,
        s3_img_link,
        user_id,
      };
      try {
        const response = await fetch('/api/fruit_locations', {
          method: 'POST', // Specify the HTTP method as POST
          headers: {
            'Content-Type': 'application/json', // Set the Content-Type header to indicate JSON data
          },
          body: JSON.stringify(data), // Stringify the JavaScript object into JSON format
        });

        if (!response.ok) throw new Error(response.statusText);
      } catch (e) {
        console.error(e);
        setError(true);
      }
      setSaving(false);
    }
  }

  return [addFruit, saving, error];
}
