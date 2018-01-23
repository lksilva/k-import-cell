CREATE TABLE users (
     id INT NOT NULL AUTO_INCREMENT,
     login varchar(45) NOT NULL,
     password varchar(255) NOT NULL,
     name VARCHAR(255) NOT NULL,
     adress VARCHAR(255),
     city VARCHAR(45),
     cep varchar(45),
     country VARCHAR(45),
     full_permission boolean NOT NULL,
     date_of_birth date,
     PRIMARY KEY (id)
);

-- City varchar(255) DEFAULT 'Sandnes'

INSERT INTO users (login, password, name, adress, city, cep, country, full_permission, date_of_birth)
VALUES ('admin', 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec',
'ADMIN', 'Rua A', 'Fortaleza', '6176000', 'Brasil', true,  STR_TO_DATE('31-01-2017', '%d-%m-%Y') );

CREATE TABLE product (
	id INT NOT NULL AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    name varchar(255) NOT NULL,
    bar_code varchar(255),
    sale_value float NOT NULL,
    purchase_price float NOT NULL,
    amount INT,
    PRIMARY KEY (id)
);

INSERT INTO product (description, name , bar_code, sale_value, purchase_price, amount)
VALUES ('Produto de alta qualidade', 'iPhone 7', '82102388128302823', 14.32, 2.12, 897);

CREATE TABLE sale (
	id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    sale_date datetime not null,
    type_payment varchar(45) not null,
    product_amount INT NOT NULL,
    value float not null,
    primary key (id),
	FOREIGN KEY (product_id) REFERENCES product(id) 
);

INSERT INTO sale (product_id, sale_date, type_payment, product_amount, value )
VALUES (1, now(), 'CARTÃO', 3, 142.21);

CREATE TABLE negative_values (
	id INT NOT NULL AUTO_INCREMENT,
    description VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    date_of_insert date,
    PRIMARY KEY (id)
);

INSERT INTO negative_values (description, value, date_of_insert)
VALUES ('iPhone com defeito', 1900.32, now());