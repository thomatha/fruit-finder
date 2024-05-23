import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tree_id = searchParams.get('tree_id');
    const user_id = searchParams.get('user_id');
    const rating = searchParams.get('rating');

    let fruitTreeReviews = null;

    if(tree_id && user_id) {
        // Return an error if both parameters are specified
        return NextResponse.json({ error: 'Bad request. You may only provide one parameter.' }, { status: 400 });
    }
    else if(tree_id && rating) {
        // Fetch a specific fruit tree location's average rating
        try {
            const rating = await sql`
                SELECT  SUM(ftr.rating) AS avgSum,
                        COUNT(*) AS avgCount
                FROM 
                    fruit_tree_reviews ftr
                JOIN
                    users u
                ON  u.id = ftr.user_id

                WHERE
                    ftr.tree_id = ${tree_id};
            `;
            return NextResponse.json(rating.rows, { status: 201 });
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when fetching fruit tree reviews.' }, { status: 500 });
        }
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
                    ftr.review_text,
                    ftr.created,
                    ftr.updated,
                    u.image,
                    u.name
                FROM 
                    fruit_tree_reviews ftr
                JOIN
                    users u
                ON  u.id = ftr.user_id

                WHERE
                    ftr.tree_id = ${tree_id}
                ORDER BY ftr.created DESC;
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
                    ftr.review_text,
                    ftr.created,
                    ftr.updated,
                    ftl.latitude,
                    ftl.longitude
                FROM 
                    fruit_tree_reviews ftr
                JOIN
                    fruit_tree_locations ftl
                ON
                    ftl.id = ftr.tree_id
                WHERE
                    ftr.user_id = ${user_id}
                ORDER BY ftr.created DESC;
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

    const session = await getServerSession(authOptions);

    // Check that session exists, and that the frontend session matches server session
    if(!session || !session.user || data.userId !== session.user.id) {
        return NextResponse.json({error: 'You are not authorized to POST to this resource'}, {status: 401});
    }

    try {
        const review = await sql`
                INSERT INTO Fruit_Tree_Reviews
                    (tree_id, user_id, rating, review_text, created)
                VALUES 
                    (${data.treeId}, ${data.userId}, ${data.rating}, ${data.text}, now())
                RETURNING tree_id, user_id, rating, review_text, created;
            `;
        return NextResponse.json(review.rows, { status: 201 });

    } catch (e) {
        return NextResponse.json({ error: 'An error occurred when creating fruit tree review.' }, { status: 500 });
    }  
}
export async function PATCH(request: Request) {
    const data = await request.json();
    if (!data || !data.reviewId || !data.rating || !data.text) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }

    try {
        await sql`
                UPDATE Fruit_Tree_Reviews
                SET rating = ${data.rating},
                review_text = ${data.text}
                WHERE id =  ${data.reviewId};
            `;
        return NextResponse.json({}, { status: 201 });

    } catch (e) {
        return NextResponse.json({ error: 'An error occurred when deleting a fruit tree review.' }, { status: 500 });
    }  
}

export async function DELETE(request: Request) {
    const data = await request.json();
    if (!data || !data.reviewId) {
        return NextResponse.json({ error: 'The request body is missing a required attribute' }, { status: 400 });
    }

    try {
        await sql`
                DELETE FROM Fruit_Tree_Reviews
                WHERE id =  ${data.reviewId};
            `;
        return NextResponse.json({}, { status: 201 });

    } catch (e) {
        return NextResponse.json({ error: 'An error occurred when deleting a fruit tree review.' }, { status: 500 });
    }  
}