-- Field Agents Table
CREATE TABLE IF NOT EXISTS field_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'admin', 'supervisor')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Land Listings Table
CREATE TABLE IF NOT EXISTS land_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES field_agents(id) ON DELETE CASCADE,

  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,

  -- Location
  country_code TEXT DEFAULT 'GN',
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),

  -- Land Details
  land_size_value NUMERIC NOT NULL,
  land_size_unit TEXT NOT NULL,
  land_type TEXT NOT NULL,
  zoning_classification TEXT,
  title_deed_status TEXT,
  title_deed_number TEXT,

  -- Physical Characteristics
  topography TEXT,
  topography_notes TEXT,
  soil_type TEXT,
  vegetation_cover TEXT,

  -- Infrastructure
  road_access TEXT,
  road_access_notes TEXT,
  distance_to_main_road_km NUMERIC,
  has_electricity BOOLEAN DEFAULT false,
  has_water BOOLEAN DEFAULT false,
  has_sewage BOOLEAN DEFAULT false,
  utilities_notes TEXT,

  -- Nearby Amenities
  distance_to_market_km NUMERIC,
  distance_to_school_km NUMERIC,
  distance_to_hospital_km NUMERIC,
  distance_to_town_center_km NUMERIC,

  -- Pricing
  total_price NUMERIC NOT NULL,
  price_per_unit NUMERIC,
  currency_code TEXT DEFAULT 'GNF',
  price_negotiable BOOLEAN DEFAULT true,

  -- African Context
  flood_risk TEXT,
  environmental_concerns TEXT,
  development_potential TEXT,
  nearby_developments TEXT,
  community_traditional_authority TEXT,
  has_land_disputes BOOLEAN DEFAULT false,
  land_disputes_notes TEXT,
  seasonal_access TEXT,
  mobile_network_coverage TEXT,
  security_situation TEXT,
  local_language TEXT,
  customary_rights_notes TEXT,

  -- Owner Information
  owner_business_name TEXT NOT NULL,
  owner_contact_person TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,

  -- Metadata
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES field_agents(id),
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Catalog Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES field_agents(id) ON DELETE CASCADE,

  -- Product Info
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  product_code TEXT,
  unit_measure TEXT NOT NULL,

  -- Pricing
  sell_price NUMERIC,
  currency TEXT DEFAULT 'GNF',
  handling_fee_per_unit NUMERIC,
  delivery_cost_per_km NUMERIC,
  minimum_order_quantity INTEGER,
  maximum_order_quantity INTEGER,

  -- Metadata
  tags TEXT[],
  specifications JSONB,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  availability_status TEXT DEFAULT 'in_stock' CHECK (availability_status IN ('in_stock', 'out_of_stock', 'discontinued')),

  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES field_agents(id),
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors Table (for product suppliers)
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,

  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,

  vendor_product_code TEXT,
  price_per_unit NUMERIC NOT NULL,
  currency TEXT DEFAULT 'GNF',
  quantity_available INTEGER NOT NULL,
  minimum_order_quantity INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos/Assets Table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES field_agents(id) ON DELETE CASCADE,

  entity_type TEXT NOT NULL CHECK (entity_type IN ('land_listing', 'product')),
  entity_id UUID NOT NULL,

  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,

  caption TEXT,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_land_listings_agent ON land_listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_land_listings_status ON land_listings(status);
CREATE INDEX IF NOT EXISTS idx_land_listings_location ON land_listings(country_code, region, city);
CREATE INDEX IF NOT EXISTS idx_products_agent ON products(agent_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_assets_entity ON assets(entity_type, entity_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_land_listings_updated_at ON land_listings;
CREATE TRIGGER update_land_listings_updated_at
  BEFORE UPDATE ON land_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_field_agents_updated_at ON field_agents;
CREATE TRIGGER update_field_agents_updated_at
  BEFORE UPDATE ON field_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
