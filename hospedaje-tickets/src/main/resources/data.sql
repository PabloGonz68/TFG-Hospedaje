-- USUARIOS
INSERT INTO usuarios (email, password, nombre, apellidos, fecha_registro) VALUES
('juan@gmail.com', '12345678_L', 'Juan', 'Gómez', NOW()),
('ana@gmail.com', '12345678_L', 'Ana', 'Martínez', NOW()),
('lucia@gmail.com', '12345678_L', 'Lucía', 'Fernández', NOW());

-- HOSPEDAJE creado por Juan
INSERT INTO hospedaje (id_hospedaje, nombre, direccion, codigo_postal, ciudad, pais, capacidad, tipo_zona, descripcion, ubicacion, visible, fecha_creacion, anfitrion_id) VALUES
(1, 'Casa en el Campo', 'Calle de los Sauces 123', '12345', 'Villa del Lago', 'Argentina', 4, 'PUEBLO', 'Una hermosa casa frente al lago ideal para relajarse.', 'https://maps.google.com/?q=-34.6037,-58.3816', true, NOW(), 1);

-- TICKETS (siguiendo tus JSONs)

-- Juan (id=1) tiene 2 tickets CIUDAD
INSERT INTO ticket (id_ticket, propietario_id, tipo_ticket) VALUES
(1, 1, 'CIUDAD'),
(2, 1, 'CIUDAD');

-- Ana (id=2) tiene 2 tickets CIUDAD
INSERT INTO ticket (id_ticket, propietario_id, tipo_ticket) VALUES
(3, 2, 'CIUDAD'),
(4, 2, 'CIUDAD');

-- Lucía (id=3) tiene 1 ticket CIUDAD (pero no aporta en el grupo)
INSERT INTO ticket (id_ticket, propietario_id, tipo_ticket) VALUES
(5, 3, 'CIUDAD');

-- GRUPO DE VIAJE (id=1)
INSERT INTO grupo_viaje (id_grupo, nombre_grupo, creador_id) VALUES
(1, 'Grupo Test', 1);

-- MIEMBROS DEL GRUPO
INSERT INTO miembro_grupo (id_miembro, grupo_viaje_id, usuario_id, tickets_aportados) VALUES
(1, 1, 1, 2),  -- Juan aporta 2
(2, 1, 2, 1),  -- Ana aporta 1
(3, 1, 3, 0);  -- Lucía no aporta
