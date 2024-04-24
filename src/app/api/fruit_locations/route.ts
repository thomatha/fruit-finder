import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Fetch endpoint for fetching fruit tree location data
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const radius = searchParams.get('radius');
    const fruitId = searchParams.get('fruit_id');
    const all = searchParams.get('all');

    // TODO: Figure out what these boundary variables are actually named, when passed from the frontend
    const latitude_boundary_east = searchParams.get('latitude_boundary_east');
    const latitude_boundary_west = searchParams.get('latitude_boundary_west');
    const longitude_boundary_north = searchParams.get('longitude_boundary_north');
    const longitude_boundary_south = searchParams.get('longitude_boundary_south');

    let fruitTreeLocations = null;

    if(id) {
        // Fetch a specific fruit tree location's information
        try {
            fruitTreeLocations = await sql`
                SELECT 
                    ftl.name AS fruit_tree_name, 
                    ftl.latitude, 
                    ftl.longitude, 
                    f.name AS fruit_name, 
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
                            ftl.name AS fruit_tree_name, 
                            ftl.latitude, 
                            ftl.longitude, 
                            f.idk AS fruit_id,
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
                            ftl.name AS fruit_tree_name, 
                            ftl.latitude, 
                            ftl.longitude, 
                            f.idk AS fruit_id,
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
    } else if(latitude_boundary_east && latitude_boundary_west && longitude_boundary_north && longitude_boundary_south) {
        // Fetch all fruit tree locations within a specified bounding box
        if(fruitId) {
            try {
                fruitTreeLocations = await sql`
                    SELECT 
                        ftl.name AS fruit_tree_name, 
                        ftl.latitude, 
                        ftl.longitude, 
                        f.name AS fruit_name, 
                        f.color 
                    FROM 
                        fruit_tree_locations ftl
                    LEFT JOIN 
                        fruits f ON ftl.fruit_id = f.id
                    WHERE ftl.latitude BETWEEN ${latitude_boundary_east} AND ${latitude_boundary_west}
                    AND ftl.longitude BETWEEN ${longitude_boundary_north} AND ${longitude_boundary_south}
                    AND f.id = ${fruitId};
                `;
            } catch(e) {
                return NextResponse.json({ error: 'An error occurred when fetching fruit tree locations' }, { status: 500 });
            }
        } else {
            try {
                fruitTreeLocations = await sql`
                    SELECT 
                        ftl.name AS fruit_tree_name, 
                        ftl.latitude, 
                        ftl.longitude, 
                        f.name AS fruit_name, 
                        f.color 
                    FROM 
                        fruit_tree_locations ftl
                    LEFT JOIN 
                        fruits f ON ftl.fruit_id = f.id
                    WHERE ftl.latitude BETWEEN ${latitude_boundary_east} AND ${latitude_boundary_west}
                    AND ftl.longitude BETWEEN ${longitude_boundary_north} AND ${longitude_boundary_south};
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
                        ftl.name AS fruit_tree_name, 
                        ftl.latitude, 
                        ftl.longitude, 
                        f.name AS fruit_name, 
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
                        ftl.name AS fruit_tree_name, 
                        ftl.latitude, 
                        ftl.longitude, 
                        f.name AS fruit_name, 
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


// Post endpoint for creating a new fruit tree location
export async function POST(request: Request) {
    const data = await request.json();

    if(!data || !data.name || !data.latitude || !data.longitude || !data.fruit_id) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }

    try {
        await sql`
            INSERT INTO fruit_tree_locations 
                (name, latitude, longitude, fruit_id)
            VALUES 
                ('${data.name}', ${data.latitude}, ${data.longitude}, ${data.fruit_id});
        `;
    } catch(e) {
        return NextResponse.json({ error: 'An error occurred when creating fruit tree location' }, { status: 500 });
    }

    return NextResponse.json({ }, { status: 201 });
}


// Put endpoint for updating a fruit tree location
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();

    if(!id || !data || !data.name || !data.latitude || !data.longitude || !data.fruit_id) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }

    try {
        await sql`
            UPDATE fruit_tree_locations
            SET 
                name = '${data.name}',
                latitude = ${data.latitude},
                longitude = ${data.longitude},
                fruit_id = ${data.fruit_id}
            WHERE id = ${id};
        `;
    } catch(e) {
        return NextResponse.json({ error: 'An error occurred when updating fruit tree location' }, { status: 500 });
    }

    return NextResponse.json({ }, { status: 200 });
}


// Delete endpoint for deleting fruit tree location data
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if(!id) {
        return NextResponse.json({ error: 'The request body is missing at least one of the required attributes' }, { status: 400 });
    }
    
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

    return NextResponse.json({ }, { status: 204 });
}