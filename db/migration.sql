DROP TABLE IF EXISTS character CASCADE;
DROP TABLE IF EXISTS item CASCADE;

CREATE TABLE character (
    char_id SERIAL PRIMARY KEY,
    char_name varchar(50)
);

CREATE TABLE item (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(50),
    item_value INTEGER
);

