import { pool } from '../../db';

export default async function handler(req, res) {
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
                fruits f ON ftl.fruit_id = f.id
        `);
        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error when executing query', e);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

export { handler as GET, handler as POST };
