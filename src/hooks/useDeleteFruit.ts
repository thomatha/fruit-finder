import { Fruit } from '@/types';
import { useState } from 'react';

// This is the hook return type
type DeleteFruitData = [(tree: number) => void, boolean, boolean];

export default function useDeleteFruit(): DeleteFruitData {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function deleteFruit(tree: number): Promise<void> {
    setSaving(true);

    try {
      const response = await fetch(`/api/fruit_locations?id=${tree}`, {
        method: 'DELETE', // Specify the HTTP method as DELETE
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header to indicate JSON data
        },
      });

      if (!response.ok) throw new Error(response.statusText);
    } catch (e) {
      console.error(e);
      setError(true);
    }
    setSaving(false);
  }

  return [deleteFruit, saving, error];
}
