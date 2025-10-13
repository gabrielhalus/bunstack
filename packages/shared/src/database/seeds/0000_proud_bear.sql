INSERT INTO "roles" ("id", "name", "label", "description", "index", "is_default", "is_super_admin") VALUES
(1, 'member', 'Member', 'Regular user with basic access privileges.', 10, TRUE, FALSE),
(2, 'admin', 'Admin', 'User with administrative privileges to manage system settings.', 100, FALSE, TRUE),

INSERT INTO "users" ("id", "name", "email", "password") VALUES
('lUDO0Y9X3uL4iL3DCRa97', 'Gabriel Halus', 'gabrielhalus@gmail.com', '$argon2id$v=19$m=65536,t=2,p=1$hMQWK8raUYBIBqiiCKTF7v7wfU/BJm8A/iA5A4cpDSg$TjHvNedPFBYaOHhZ7q0JDaT734G5qltgdj6/yzsKTXs');

INSERT INTO "user_roles" ("user_id", "role_id") VALUES
('lUDO0Y9X3uL4iL3DCRa97', 1),
('lUDO0Y9X3uL4iL3DCRa97', 2);
