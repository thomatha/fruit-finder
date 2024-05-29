import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

/**
 * GET endpoint for fetching fruit type data
 * @return {Fruit[]} the list of fruit type records
 */
export async function GET(request: Request) {
  // Fetch a list of fruit types (for populating fruit filter)
  try {
    const fruitList = await sql`
            SELECT 
                f.id AS fruit_id,
                f.name AS fruit_name, 
                f.color 
            FROM 
                fruits f;
        `;
    return NextResponse.json(fruitList.rows, { status: 200 });
  } catch (e) {
    return NextResponse.json('An error occurred when fetching fruit list', {
      status: 500,
    });
  }
}
