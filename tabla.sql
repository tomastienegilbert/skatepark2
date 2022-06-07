-- DATABASE E skatepark

CREATE TABLE skaters (
    id SERIAL,
    email VARCHAR(255) PRIMARY KEY NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    anos_experiencia INT NOT NULL,
    especialidad VARCHAR(255) NOT NULL,
    foto VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT FALSE
    );