INSERT INTO "users" ("id", "name", "email", "password", "avatar", "created_at", "updated_at") VALUES
('JyuT8xcpE2NUFf9_SPxc_', 'Ita Dakimasu', 'itadakimasu@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$R0MwHjZBUMoLfGUmKeNRug$xWp6FErEcR3WPI+BhSVRLI/7V+TMcRbWREsTsoI9+tc', 'https://i.pinimg.com/736x/08/9a/cf/089acf1253ec41d36e6fcd90277c75be.jpg', 1735686000, 1735686000),
('M90DRMRqUtchFdB47Uj-w', 'Konni Chiwa', 'konnichiwa@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$R0MwHjZBUMoLfGUmKeNRug$xWp6FErEcR3WPI+BhSVRLI/7V+TMcRbWREsTsoI9+tc', NULL, 1735686000, 1735686000),
('l1knWD3gwIavSLDsDxHI5', 'Mura Saki', 'murasaki@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$R0MwHjZBUMoLfGUmKeNRug$xWp6FErEcR3WPI+BhSVRLI/7V+TMcRbWREsTsoI9+tc', NULL, 1735686000, 1735686000);
--> statement-breakpoint
INSERT INTO "roles" ("id", "name", "label", "description", "level", "is_default", "is_super_admin", "created_at", "updated_at") VALUES
(1, 'admin', 'Administrator', 'Full access and control.', 100, 0, 1, 1735686000, 1735686000),
(2, 'user', 'User', 'Basic access to the platform.', 10, 1, 0, 1735686000, 1735686000),
(3, 'moderator', 'Moderator', 'Can moderate user content.', 20, 0, 0, 1735686000, 1735686000);
--> statement-breakpoint
INSERT INTO "user_roles" ("user_id", "role_id") VALUES
('JyuT8xcpE2NUFf9_SPxc_', 2),
('JyuT8xcpE2NUFf9_SPxc_', 1),
('M90DRMRqUtchFdB47Uj-w', 2),
('l1knWD3gwIavSLDsDxHI5', 2),
('l1knWD3gwIavSLDsDxHI5', 3);
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission") VALUES
-- user
(2, 'user:read'),
(2, 'user:edit'),
(2, 'user:delete'),
-- moderator
(3, 'user:list'),
(3, 'role:read');
(3, 'role:update');
(3, 'role:delete');
(3, 'role:list');
--> statement-breakpoint
INSERT INTO "policies" ("id", "role_id", "permission", "effect", "condition", "description", "created_at", "updated_at") VALUES
-- Enforce "self" condition for users
(1, 2, 'user:read', 'allow', '{"op": "eq", "left": {"type": "user_attr", "key": "id"}, "right": {"type": "resource_attr", "key": "id"}}', 'Allow users to read their own profile', 1735686000, 1735686000),
(2, 2, 'user:edit', 'allow', '{"op": "eq", "left": {"type": "user_attr", "key": "id"}, "right": {"type": "resource_attr", "key": "id"}}', 'Allow users to edit their own profile', 1735686000, 1735686000),
(3, 2, 'user:delete', 'allow', '{"op": "eq", "left": {"type": "user_attr", "key": "id"}, "right": {"type": "resource_attr", "key": "id"}}', 'Allow users to delete their own profile', 1735686000, 1735686000);
