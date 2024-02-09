DROP TABLE IF EXISTS character CASCADE;
DROP TABLE IF EXISTS item CASCADE;
DROP TABLE IF EXISTS char_item CASCADE;

CREATE TABLE character (
    char_id SERIAL PRIMARY KEY,
    char_name varchar(50)
);

CREATE TABLE item (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(50),
    item_value INTEGER
);

CREATE TABLE char_item (
    char_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    qty INTEGER,
    FOREIGN KEY (char_id) REFERENCES character(char_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(item_id) ON UPDATE CASCADE ON DELETE CASCADE
)

