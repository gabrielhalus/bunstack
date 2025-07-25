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
INSERT INTO "permissions" ("id", "name", "label", "created_at", "updated_at") VALUES
-- users
(1, 'view:users', 'View Users', 1735686000, 1735686000),
(2, 'update:users', 'Update Users', 1735686000, 1735686000),
(3, 'delete:users', 'Delete Users', 1735686000, 1735686000),
(4, 'manage:users', 'Manage Users', 1735686000, 1735686000),
-- roles
(5, 'view:roles', 'View Roles', 1735686000, 1735686000),
(6, 'update:roles', 'Update Roles', 1735686000, 1735686000),
(7, 'delete:roles', 'Delete Roles', 1735686000, 1735686000),
(8, 'manage:roles', 'Manage Roles', 1735686000, 1735686000);
--> statement-breakpoint
INSERT INTO "role_permissions" ("role_id", "permission_id") VALUES
-- user
(2, 1), -- view:users
(2, 2), -- update:users
(2, 3), -- delete:users
(2, 5), -- view:roles
-- moderator
(3, 4), -- manage:users
(3, 5), -- view:roles
(3, 6), -- update:roles
(3, 7), -- delete:roles
(3, 8); -- manage:roles
--> statement-breakpoint
INSERT INTO "policies" ("id", "role_id", "permission_id", "effect", "condition", "created_at", "updated_at") VALUES
-- Enforce "self" condition for users
(1, 2, 1, 'allow', '{"op": "eq", "left": {"type": "user_attr", "key": "id"}, "right": {"type": "resource_attr", "key": "id"}}', 1735686000, 1735686000),
(2, 2, 2, 'allow', '{"op": "eq", "left": {"type": "user_attr", "key": "id"}, "right": {"type": "resource_attr", "key": "id"}}', 1735686000, 1735686000),
(3, 2, 3, 'allow', '{"op": "eq", "left": {"type": "user_attr", "key": "id"}, "right": {"type": "resource_attr", "key": "id"}}', 1735686000, 1735686000),
(4, 2, 6, 'allow', '{"op": "in", "left": {"type": "resource_attr", "key": "id"}, "right": {"type": "user_attr", "key": "roles"}}', 1735686000, 1735686000),
(5, 2, 7, 'allow', '{"op": "in", "left": {"type": "resource_attr", "key": "id"}, "right": {"type": "user_attr", "key": "roles"}}', 1735686000, 1735686000),
(6, 2, 8, 'allow', '{"op": "in", "left": {"type": "resource_attr", "key": "id"}, "right": {"type": "user_attr", "key": "roles"}}', 1735686000, 1735686000);