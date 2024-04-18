CREATE TABLE IF NOT EXISTS Fruits (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	color VARCHAR(255) NOT NULL
);

INSERT INTO Fruits (name, color)
VALUES ('Blackberry', '35, 3, 48'),
('Golden Plum', '199, 190, 91'),
('Cherry', '196, 106, 147');