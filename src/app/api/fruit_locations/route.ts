import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * GET endpoint for fetching fruit tree location data. All properties are URL search parameters
 * 
 * Option 1 - Get a specific fruit tree location
 * @property  {int} id the unique id of a specific fruit tree location
 * 
 * For the rest of the options, can include an optional fruit type filter:
 * @property  {int} fruit_id the unique id of a fruit type
 * 
 * Option 2 - Get all fruit tree locations within a radius of a specified point
 * @property  {float} latitude the latitude of the chosen point
 * @property  {float} longitude the longitude of the chosen point
 * @property  {float} radius the radius around the point to fetch fruit trees (miles by default)
 * 
 * Option 3 - Get all fruit tree locations within a bounding box
 * @property  {float} east the eastern side of the box
 * @property  {float} west the western side of the box
 * @property  {float} north the northern side of the box
 * @property  {float} south the southern side of the box
 * 
 * Option 4 - Get all fruit tree locations
 * @property  {int} all If this parameter exists, fetch all fruit tree locations
 * 
 * @return {FruitTreeLocation[]} the list of fruit tree location records 
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const radius = searchParams.get('radius');
    const fruitId = searchParams.get('fruit_id');
    const all = searchParams.get('all');

    const east = searchParams.get('east');
    const west = searchParams.get('west');
    const north = searchParams.get('north');
    const south = searchParams.get('south');

    let fruitTreeLocations = null;

    if(id) {
        // Fetch a specific fruit tree location's information
        try {
            fruitTreeLocations = await sql`
                SELECT 
                    ftl.id,
                    ftl.name AS fruit_tree_name,
                    ftl.description, 
                    ftl.latitude, 
                    ftl.longitude, 
                    ftl.s3_img_link,
                    ftl.user_id,
                    f.name AS fruit_name, 
                    f.id AS fruit_id,
                    f.color 
                FROM 
                    fruit_tree_locations ftl
                LEFT JOIN 
                    fruits f ON ftl.fruit_id = f.id
                WHERE
                    ftl.id = ${id};
            `;

            if(!fruitTreeLocations || fruitTreeLocations.rowCount === 0) {
                return NextResponse.json({ error: 'Could not find a fruit tree location with the specified ID' }, { status: 404 });
            }
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
        }
    } else if(longitude && latitude && radius) {
        // Fetch all fruit tree locations within a radius of a given point, using the Haversine formula
        // This is in miles. If we wanted kilometers, we would plug in the KM constant instead
        const earthRadiusMiles = 3959;
        const earthRadiusKm = 6371;
        if(fruitId) {
            try {
                fruitTreeLocations = await sql`
                    SELECT * FROM (
                        SELECT 
                            ftl.id,
                            ftl.name AS fruit_tree_name, 
                            ftl.latitude, 
                            ftl.longitude,
                            ftl.user_id,
                            f.id AS fruit_id,
                            f.name AS fruit_name, 
                            f.color,
                            ( ${earthRadiusMiles} * acos( cos( radians( ${latitude} ) ) * 
                                cos( radians( ftl.latitude ) ) * 
                                cos( radians( ftl.longitude ) - 
                                radians( ${longitude} ) ) + 
                                sin( radians( ${latitude} ) ) * 
                                sin( radians( ftl.latitude ) ) ) ) 
                            AS distance
                        FROM 
                            fruit_tree_locations ftl
                        LEFT JOIN 
                            fruits f ON ftl.fruit_id = f.id
                    ) trees
                    WHERE distance < ${radius}
                    AND trees.fruit_id = ${fruitId}
                    ORDER BY ftl.id DESC
                    LIMIT 100;
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
            }
        } else {
            try {
                fruitTreeLocations = await sql`
                    SELECT * FROM (
                        SELECT 
                            ftl.id,
                            ftl.name AS fruit_tree_name, 
                            ftl.latitude, 
                            ftl.longitude, 
                            ftl.user_id,
                            f.id AS fruit_id,
                            f.name AS fruit_name, 
                            f.color,
                            ( ${earthRadiusMiles} * acos( cos( radians( ${latitude} ) ) * 
                                cos( radians( ftl.latitude ) ) * 
                                cos( radians( ftl.longitude ) - 
                                radians( ${longitude} ) ) + 
                                sin( radians( ${latitude} ) ) * 
                                sin( radians( ftl.latitude ) ) ) ) 
                            AS distance
                        FROM 
                            fruit_tree_locations ftl
                        LEFT JOIN 
                            fruits f ON ftl.fruit_id = f.id
                    ) trees
                    WHERE distance < ${radius}
                    ORDER BY ftl.id DESC
                    LIMIT 100;
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
            }
        }
    } else if(east && west && north && south) {
        // Fetch all fruit tree locations within a specified bounding box
        if(fruitId) {
            try {
                fruitTreeLocations = await sql`
                    SELECT 
                        ftl.id,
                        ftl.name AS fruit_tree_name, 
                        ftl.latitude, 
                        ftl.longitude, 
                        ftl.user_id,
                        f.name AS fruit_name, 
                        f.id AS fruit_id,
                        f.color 
                    FROM 
                        fruit_tree_locations ftl
                    LEFT JOIN 
                        fruits f ON ftl.fruit_id = f.id
                    WHERE ftl.latitude BETWEEN ${south} AND ${north}
                    AND ftl.longitude BETWEEN ${west} AND ${east}
                    AND f.id = ${fruitId};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
            }
        } else {
            try {
                fruitTreeLocations = await sql`
                    SELECT 
                        ftl.id,
                        ftl.name AS fruit_tree_name, 
                        ftl.description, 
                        ftl.latitude, 
                        ftl.longitude,
                        ftl.user_id,
                        f.name AS fruit_name, 
                        f.id AS fruit_id,
                        f.color 
                    FROM 
                        fruit_tree_locations ftl
                    LEFT JOIN 
                        fruits f ON ftl.fruit_id = f.id
                    WHERE ftl.latitude BETWEEN ${south} AND ${north}
                    AND ftl.longitude BETWEEN ${west} AND ${east};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
            }
        }
    } else if(all) {
        // Fetch all fruit tree locations wherever they may be (This is likely only going to be used for debug purposes)
        if(fruitId) {
            try {
                fruitTreeLocations = await sql`
                    SELECT 
                        ftl.id,
                        ftl.name AS fruit_tree_name, 
                        ftl.latitude, 
                        ftl.longitude, 
                        ftl.user_id,
                        f.name AS fruit_name, 
                        f.id AS fruit_id,
                        f.color 
                    FROM 
                        fruit_tree_locations ftl
                    LEFT JOIN 
                        fruits f ON ftl.fruit_id = f.id
                    WHERE f.id = ${fruitId};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
            }
        } else {
            try {
                fruitTreeLocations = await sql`
                    SELECT 
                        ftl.id,
                        ftl.name AS fruit_tree_name, 
                        ftl.latitude, 
                        ftl.longitude, 
                        ftl.user_id,
                        f.name AS fruit_name, 
                        f.id AS fruit_id,
                        f.color 
                    FROM 
                        fruit_tree_locations ftl
                    LEFT JOIN 
                        fruits f ON ftl.fruit_id = f.id;
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
            }
        }
    } else {
        return NextResponse.json({ error: 'The URL search parameters could not be parsed' }, { status: 400 });
    }
    
    return NextResponse.json( fruitTreeLocations.rows , { status: 200 });
}


// POST endpoint for creating a new fruit tree location
// TODO - expand this comment into more descriptive JSDoc
export async function POST(request: Request) {
    const data = await request.json();

    if(!data || !data.name || !data.latitude || !data.longitude || !data.fruit_id || !data.user_id) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    // Check that session exists, and that the frontend session matches server session
    if(!session || !session.user || data.user_id !== session.user.id) {
        return NextResponse.json({error: 'You are not authorized to POST to this resource'}, {status: 401});
    }

    if(!data.description && !data.s3_img_link) {
        try {
            await sql`
                INSERT INTO fruit_tree_locations 
                    (name, latitude, longitude, fruit_id, user_id)
                VALUES 
                    (${data.name}, ${data.latitude}, ${data.longitude}, ${data.fruit_id}, ${data.user_id});
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when creating fruit tree location' }, { status: 500 });
        }
    } else if (data.s3_img_link && !data.description) {
        try {
            await sql`
                INSERT INTO fruit_tree_locations 
                    (name, latitude, longitude, s3_img_link, fruit_id, user_id)
                VALUES 
                    (${data.name}, ${data.latitude}, ${data.longitude}, ${data.s3_img_link}, ${data.fruit_id}, ${data.user_id});
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when creating fruit tree location' }, { status: 500 });
        }
    } else if (!data.s3_img_link && data.description) {
        try {
            await sql`
                INSERT INTO fruit_tree_locations 
                    (name, description, latitude, longitude, fruit_id, user_id)
                VALUES 
                    (${data.name}, ${data.description}, ${data.latitude}, ${data.longitude}, ${data.fruit_id}, ${data.user_id});
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when creating fruit tree location' }, { status: 500 });
        }
    } else {
        try {
            await sql`
                INSERT INTO fruit_tree_locations 
                    (name, description, latitude, longitude, s3_img_link, fruit_id, user_id)
                VALUES 
                    (${data.name}, ${data.description}, ${data.latitude}, ${data.longitude}, ${data.s3_img_link}, ${data.fruit_id}, ${data.user_id});
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when creating fruit tree location' }, { status: 500 });
        }
    }

    return NextResponse.json({ }, { status: 201 });
}


// PUT endpoint for updating a fruit tree location
// TODO - expand this comment into more descriptive JSDoc
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const latest = searchParams.get('latest');
    const data = await request.json();

    if(!(id || latest) || !data || !data.name || !data.latitude || !data.longitude || !data.fruit_id) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }

    if(id) {
        if(!data.description && !data.s3_img_link) {
            try {
                await sql`
                    UPDATE fruit_tree_locations
                    SET 
                        name = ${data.name},
                        latitude = ${data.latitude},
                        longitude = ${data.longitude},
                        fruit_id = ${data.fruit_id}
                    WHERE id = ${id};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when updating fruit tree location' }, { status: 500 });
            }
        } else if(!data.description && data.s3_img_link) {
            try {
                await sql`
                    UPDATE fruit_tree_locations
                    SET 
                        name = ${data.name},
                        latitude = ${data.latitude},
                        longitude = ${data.longitude},
                        fruit_id = ${data.fruit_id},
                        s3_img_link = ${data.s3_img_link}
                    WHERE id = ${id};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when updating fruit tree location' }, { status: 500 });
            }
        } else if(data.description && !data.s3_img_link) {
            try {
                await sql`
                    UPDATE fruit_tree_locations
                    SET 
                        name = ${data.name},
                        latitude = ${data.latitude},
                        longitude = ${data.longitude},
                        fruit_id = ${data.fruit_id},
                        description = ${data.description}
                    WHERE id = ${id};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when updating fruit tree location' }, { status: 500 });
            }
        } else {
            try {
                await sql`
                    UPDATE fruit_tree_locations
                    SET 
                        name = ${data.name},
                        latitude = ${data.latitude},
                        longitude = ${data.longitude},
                        fruit_id = ${data.fruit_id},
                        description = ${data.description},
                        s3_img_link = ${data.s3_img_link}
                    WHERE id = ${id};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when updating fruit tree location' }, { status: 500 });
            }
        }
    } else {
        try {
            await sql`
                UPDATE fruit_tree_locations
                SET 
                    name = ${data.name},
                    latitude = ${data.latitude},
                    longitude = ${data.longitude},
                    fruit_id = ${data.fruit_id}
                WHERE id IN (
                    SELECT id FROM fruit_tree_locations ORDER BY id DESC LIMIT 1
                );
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when updating fruit tree location' }, { status: 500 });
        }
    }

    return NextResponse.json({ }, { status: 200 });
}


/**
 * DELETE endpoint for deleting fruit tree location data. All properties are URL search parameters
 * @property  {int} id the unique id of a specific fruit tree location
 * @property  {int} latest if this parameter exists, delete the latest added fruit tree location
 * 
 * @return { } no records
 */
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const latest = searchParams.get('latest');

    if(!id && !latest) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }
    
    if(id) {
        try {
            await sql`
                DELETE FROM 
                    fruit_tree_locations 
                WHERE 
                    id = ${id};
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when deleting fruit tree location' }, { status: 500 });
        }
    } else {
        try {
            await sql`
                DELETE FROM 
                    fruit_tree_locations 
                WHERE 
                    id IN (
                        SELECT id FROM fruit_tree_locations ORDER BY id DESC LIMIT 1
                    );
            `;
        } catch(e) {
            return NextResponse.json({ error: 'An error occurred when deleting fruit tree location' }, { status: 500 });
        }
    }

    return NextResponse.json({ }, { status: 200 });
}

/*
    TESTING CODE:
    (Currently, don't know how to make Postman play nice with Auth0)
    (But it is possible to test the endpoints by simply calling the fetch API from within your browser)
    (After running one in the browser console, you can check results by refreshing http://localhost:3000/api/fruit_locations?all=1)

    // Test POST request:
    fetch('http://localhost:3000/api/fruit_locations', { 
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: 'Oregon state university - test location',
            latitude: 44.565296,
            longitude: -123.276016,
            fruit_id: 3
        })
    })

    // Test PUT request:
    fetch('http://localhost:3000/api/fruit_locations?latest=1', { 
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: 'Oregon state university - test location, now updated!',
            latitude: 44.565296,
            longitude: -123.276016,
            fruit_id: 3
        })
    })

    // Test DELETE request:
    fetch('http://localhost:3000/api/fruit_locations?latest=1', { method: "DELETE" })
*/