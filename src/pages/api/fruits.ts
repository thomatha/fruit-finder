/* 
This file is deprecated - establishes a connection to AWS DB and executes queries on it


import { pool } from '../../db';

export default async function handler(req, res) {
    switch(req.method) {
        // Endpoint for fetching all map-relevant fruit tree location data
        case 'GET':
            try {
                const result = await pool.query(`
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
                `);
                res.status(200).json(result.rows);
            } catch (e) {
                console.error('Error when executing query', e);
                res.status(500).json({error: 'Internal Server Error'});
            }
            return;

        // Endpoint for creating a new fruit tree location
        case 'POST':
            break;

        // Endpoint for updating a fruit tree location's data
        case 'PUT':
            break;

        // Endpoint for deleting a fruit tree location's data
        case 'DELETE':
            break;
        
        // Shouldn't ever enter here, this is some other request type we don't use, such as PATCH
        default:
            console.error('Unrecognized HTTP request type');
            res.status(500).json({error: 'Internal Server Error'});
    }
};

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };

*/