import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('tree_id');

    let fruitTreeReviews = null;

    if(id) {
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
                    ftr.tree_id = ${id};
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when fetching fruit tree reviews.' }, { status: 500 });
        }
    } else {
        // Return an error if a parameter was not specified
        return NextResponse.json({ error: 'Bad request. At least one parameter is required.' }, { status: 400 });
    }
    return NextResponse.json( fruitTreeReviews.rows , { status: 200 });
}


export async function POST(request: Request) {
    const data = await request.json();
    if (!data || !data.treeId || !data.userId || !data.rating || !data.text) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }

    try {
        await sql`
                INSERT INTO Fruit_Tree_Reviews
                    (tree_id, user_id, rating, review_text)
                VALUES 
                    (${data.treeId}, ${data.userId}, ${data.rating}, ${data.text});
            `;
    } catch (e) {
        return NextResponse.json({ error: 'An error occurred when creating fruit tree review.' }, { status: 500 });
    }

    return NextResponse.json({}, { status: 201 });
}