import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  let fruitTreeReviews = null;

  if (user_id) {
    // Fetch a specific fruit tree location's reviews
    try {
      fruitTreeReviews = await sql`
                SELECT 
                    ftr.id,
                    ftr.tree_id,
                    ftr.user_id, 
                    ftr.rating, 
                    ftr.review_text
                FROM 
                    fruit_tree_reviews ftr
                WHERE
                    ftr.user_id = ${user_id};
            `;
    } catch (e) {
      return NextResponse.json(
        { error: 'An error occurred when fetching fruit tree reviews.' },
        { status: 500 },
      );
    }
  } else {
    // Return an error if a parameter was not specified
    return NextResponse.json(
      { error: 'Bad request. At least one parameter is required.' },
      { status: 400 },
    );
  }
  return NextResponse.json(fruitTreeReviews.rows, { status: 200 });
}
