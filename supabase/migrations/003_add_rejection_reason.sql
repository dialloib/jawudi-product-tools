-- Add rejection_reason column to land_listings
ALTER TABLE land_listings
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add rejection_reason column to products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN land_listings.rejection_reason IS 'Optional reason provided by admin when rejecting a submission';
COMMENT ON COLUMN products.rejection_reason IS 'Optional reason provided by admin when rejecting a submission';
