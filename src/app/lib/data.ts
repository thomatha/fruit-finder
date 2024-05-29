import { sql } from '@vercel/postgres';
import { Review } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { error } from 'console';

export async function fetchReviews() {
  noStore();
  try {
    let data = await sql<Review>`SELECT * FROM Fruit_Tree_Reviews`;
    console.log('data is: ', data.rows);
    return data.rows;
  } catch (error) {
    console.log('Database Error: ', error);
    throw new Error('Failed to fetch review data.');
  }
}
