CREATE TABLE IF NOT EXISTS Fruit_Tree_Locations (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
 	latitude FLOAT NOT NULL,
 	longitude FLOAT NOT NULL,
 	fruit_id INT NOT NULL
);

INSERT INTO Fruit_Tree_Locations (name, longitude, latitude, fruit_id)
VALUES ('UW Cherry Trees', 47.657436508293124, -122.30718647416502, 3),
('Redmond Golden Plum', 47.63906742325103, -122.1107177936996, 2),
('Issaquah Blackberries', 47.569509840522834, -122.10199923955857, 1);