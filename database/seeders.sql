-- ! Seeder SQL for boa_searchengine_clean database :

USE `boa_searchengine_clean`;

-- 1. Directions
INSERT INTO directions (name, parent_direction_id, location_id, is_active, created_at, updated_at)
VALUES
('Global', NULL, NULL, TRUE, NOW(), NOW());

-- 2. Users
INSERT INTO users (
    first_name,
    last_name,
    email,
    password,
    direction_id,
    is_admin,
    is_active,
    email_verified_at,
    created_at,
    updated_at
)
VALUES
(
    'notifications',
    'notifications',
    'notifications@restricted.com',
    '$2y$10$Hix09Xj6hOQjB07g8QX5SeB4rB1Dd8QkhqU2kEoN7dHrFG9IlufCe', -- bcrypt('passwordrestricted')
    NULL,
    FALSE,
    FALSE,
    NOW(),
    NOW(),
    NOW()
),
(
    'admin',
    'admin',
    'admin@mail.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt('password')
    NULL,
    TRUE,
    TRUE,
    NOW(),
    NOW(),
    NOW()
);

-- 3. Document Statuses 
INSERT INTO doc_statuts (name, created_at, updated_at)
VALUES
('New', NOW(), NOW()),
('Updates', NOW(), NOW()),
('Cancels', NOW(), NOW()),
('Updated', NOW(), NOW()),
('Canceled', NOW(), NOW());

-- 4. Document Types 
INSERT INTO doc_types (name, is_active, created_at, updated_at)
VALUES
('Note', TRUE, NOW(), NOW());


-- ? note : it doesn't seed a document
