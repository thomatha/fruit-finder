CREATE TABLE IF NOT EXISTS Fruits (
	id SERIAL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	color VARCHAR(255) 
);

INSERT INTO Fruits (name, color)
VALUES ('Blackberry', '35, 3, 48'),
('Plum', '199, 190, 91'), ('Cherry', '196, 106, 147'), ('Apple', NULL), ('Avocado', NULL), ('Banana', NULL), ('Blueberry', NULL), ('Grape', NULL), ('Green Apple', NULL), ('Honeydew', NULL), ('Kiwi', NULL), ('Lemon', NULL), ('Lime', NULL), ('Mandarin', NULL), ('Mango', NULL), ('Orange', NULL), ('Peach', NULL), ('Pear', NULL), ('Pineapple', NULL), ('Strawberry', NULL), ('Tangerine', NULL), ('Watermelon', NULL);