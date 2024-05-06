CREATE TABLE IF NOT EXISTS Fruit_Tree_Reviews (
	id SERIAL PRIMARY KEY,
	tree_id INT NOT NULL,
	user_id VARCHAR(50) NOT NULL,
	rating INT NOT NULL,
	review_text VARCHAR(500)
);