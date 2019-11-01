DROP DATABASE bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10, 2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Carrots', 'Produce', .50, 1500), ('LG OLED 65"', 'Electronics', 2399.99, 55),
    ('Fudge Stripes', 'Grocery', 2.99, 30), ('Bananas', 'Produce', .60, 5000),
    ('Pillow', 'Home', 15.99, 15), ('Keyboard', 'Electronics', 24.99, 25),
    ('Pens', 'Office', 2.99, 35), ('Paper', 'Office', 5.99, 500),
    ('Oranges', 'Produce', .30, 55), ('Table', 'Home', 1599.99, 60);