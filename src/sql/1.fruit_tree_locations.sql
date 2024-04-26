CREATE TABLE IF NOT EXISTS Fruit_Tree_Locations (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
 	latitude FLOAT NOT NULL,
 	longitude FLOAT NOT NULL,
    s3_img_link VARCHAR(255),
 	fruit_id INT NOT NULL
);

INSERT INTO Fruit_Tree_Locations (name, description, latitude, longitude, s3_img_link, fruit_id)
VALUES ('UW Cherry Trees', 'Test Desc 1', 47.657436508293124, -122.30718647416502, NULL, 3),
('Redmond Golden Plum', 'Test Desc 2', 47.63906742325103, -122.1107177936996, NULL, 2),
('Issaquah Blackberries', NULL, 47.569509840522834, -122.10199923955857, NULL, 1);