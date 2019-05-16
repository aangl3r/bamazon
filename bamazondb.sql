DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

create table products (
id INTEGER(10) AUTO_INCREMENT,
primary key (id),
product_name VARCHAR(100),
department_name VARCHAR(100),
price INTEGER(10),
stock_quantity INTEGER(10)
);

insert into products (product_name, department_name, price, stock_quantity)
values
	("blaster", "weaponry", 500, 600),
    ("lightsaber", "weaponry", 15000000, 20),
    ("turret", "weaponry", 15000, 100),
    ("helmet", "armor", 200, 1000),
    ("breastplate", "armor", 200, 1060),
    ("flightsuit", "armor", 100, 7800),
    ("AT-ST", "vehicles", 90, 800000),
    ("AT-AT", "vehicles", 40, 1020000),
    ("TIE", "vehicles", 750, 175000),
    ("jarjar", "abominations", 1, 1);

select * from products;

