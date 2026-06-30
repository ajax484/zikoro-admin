-- This script updates the eventPhoneNumber for workspaces (organizations) 
-- that currently do not have one, by fetching the phoneNumber of the workspace owner 
-- from the users table.

UPDATE organization
SET "eventPhoneNumber" = users."phoneNumber"
FROM users
WHERE organization."organizationOwner" = users."userEmail"
  AND (organization."eventPhoneNumber" IS NULL OR organization."eventPhoneNumber" = '')
  AND users."phoneNumber" IS NOT NULL
  AND users."phoneNumber" != '';
