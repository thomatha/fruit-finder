import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tree_id = searchParams.get('tree_id');
    const user_id = searchParams.get('user_id');

    let fruitTreeReviews = null;

    if(tree_id && user_id) {
        // Return an error if both parameters are specified
        return NextResponse.json({ error: 'Bad request. You may only provide one parameter.' }, { status: 400 });
    }
    else if(tree_id) {
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
                    ftr.tree_id = ${tree_id};
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when fetching fruit tree reviews.' }, { status: 500 });
        }
    } 
    else if(user_id) {
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