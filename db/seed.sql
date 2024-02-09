INSERT INTO character (char_name) VALUES ('Customer');
INSERT INTO character (char_name) VALUES ('Shopkeep');

INSERT INTO item (item_name, item_value) VALUES ('Gold', 1);
INSERT INTO item (item_name, item_value) VALUES ('Iron Sword', 8);

INSERT INTO char_item (char_id, item_id, qty) VALUES (1, 1, 0);
INSERT INTO char_item (char_id, item_id, qty) VALUES (2, 1, 100);
INSERT INTO char_item (char_id, item_id, qty) VALUES (2, 2, 1);