CREATE DATABASE dbname;
USE dbname;

CREATE TABLE your_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data VARCHAR(255) NOT NULL
);

INSERT INTO your_table (data) VALUES ('Sample Data 1'), ('Sample Data 2');