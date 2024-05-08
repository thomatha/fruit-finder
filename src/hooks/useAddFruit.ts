import { Fruit } from "@/types";
import { useState } from "react";

// This is the hook return type
type AddFruitData = [
  (fruit: Fruit, latitude: number, longitude: number) => void,
  boolean,
  boolean
];

export default function useAddFruit(): AddFruitData {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function addFruit(
    fruit: Fruit,
    latitude: number,
    longitude: number
  ): Promise<void> {
    setSaving(true);

    const data = {
      name: fruit.name,
      fruit_id: fruit.id,
      latitude,
      longitude,
    };
    try {
      const response = await fetch("/api/fruit_locations", {
        method: "POST", // Specify the HTTP method as POST
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header to indicate JSON data
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

  return [addFruit, saving, error];
}
