import { Fruit } from "@/types";
import { useState } from "react";
const AWS_BUCKET_NAME = "fruitfinder";
const AWS_REGION = "us-east-2";

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
  boolean
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
        const response = await fetch("/api/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });

        if (response.ok) {
          const { url, fields } = await response.json();

          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value as string);
          });
          formData.append("file", file);

          const uploadResponse = await fetch(url, {
            method: "POST",
            headers: { 
              "Cache-Control": 'no-cache',
              "Origin": null,
            },
            body: formData,
          });

          if (uploadResponse.ok) {
            s3_img_link = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fields.key}`;
          } else {
            console.error("S3 Upload Error:", uploadResponse);
          }
        } else {
          console.error("Failed to get pre-signed URL.");
        }
      }
    } catch(e) {
      s3_img_link = null;
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
  }

  return [addFruit, saving, error];
}
