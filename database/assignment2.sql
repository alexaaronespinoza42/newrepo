-- Account table
-- Create a new register in the table account (Tony Stark)
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update the new register in the table account (Tony Stark)
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Delete the register in the table account (Tony Stark)
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-------------------------------------------------------------------------------------------------

-- Update GM Hummer description 
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Select and Inner Join    
SELECT inv.inv_make, inv.inv_model, cl.classification_name
FROM public.inventory inv
INNER JOIN public.classification cl ON inv.classification_id = cl.classification_id
WHERE cl.classification_name = 'Sport';

-- Update inv_image and inv_thumbnail rows to add '/vehicles'
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

