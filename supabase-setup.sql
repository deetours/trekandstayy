-- ============================================
-- TREK & STAY - SUPABASE DATABASE SETUP
-- ============================================
-- Run this in Supabase SQL Editor to set up the database

-- 1. ADMIN USERS TABLE
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. TRIPS TABLE
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  descriptor TEXT NOT NULL,
  reality_note TEXT,
  region TEXT NOT NULL CHECK (region IN ('Karnataka', 'Maharashtra', 'Himachal')),
  destination TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Trek', 'Road Trip', 'Weekend Escape')),
  duration_days INTEGER NOT NULL,
  duration_label TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Moderate', 'Hard', 'Extreme')),
  starting_point TEXT,
  starting_price INTEGER NOT NULL,
  altitude TEXT,
  group_size TEXT,
  featured BOOLEAN DEFAULT false,
  featured_rank INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id)
);

-- 3. TRIP DEPARTURES TABLE
CREATE TABLE trip_departures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  capacity INTEGER NOT NULL,
  spots_left INTEGER NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. TRIP MEDIA TABLE
CREATE TABLE trip_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  kind TEXT CHECK (kind IN ('cover', 'gallery', 'highlight')),
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- 5. TRIP HIGHLIGHTS TABLE
CREATE TABLE trip_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 6. IDENTITY TAGS TABLE
CREATE TABLE identity_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 7. TRIP IDENTITY TAGS (Many-to-Many)
CREATE TABLE trip_identity_tags (
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES identity_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (trip_id, tag_id)
);

-- 8. TRIP REGIONS TABLE
CREATE TABLE trip_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 9. ITINERARY TABLE
CREATE TABLE trip_itinerary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  route TEXT NOT NULL,
  highlight TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 10. TRIP PROOF/TESTIMONIALS TABLE
CREATE TABLE trip_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,
  meta TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 11. TRIP CAPTAINS TABLE
CREATE TABLE trip_captains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- 12. BOOKINGS TABLE
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id),
  departure_id UUID REFERENCES trip_departures(id),
  booking_number TEXT UNIQUE NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  peoples_count INTEGER NOT NULL,
  emergency_contact TEXT,
  experience_level TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'awaiting_payment', 'payment_submitted', 'payment_verified', 'confirmed', 'cancelled')),
  total_amount INTEGER NOT NULL,
  base_amount INTEGER NOT NULL,
  addons_amount INTEGER DEFAULT 0,
  price_per_person INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 13. BOOKING ADDONS TABLE
CREATE TABLE booking_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  addon_id TEXT NOT NULL,
  addon_label TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 14. AVAILABLE ADDONS TABLE
CREATE TABLE available_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 15. ANALYTICS TABLE
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click_cta', 'filter_used', 'booking_started')),
  user_session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_region ON trips(region);
CREATE INDEX idx_trips_featured ON trips(featured);
CREATE INDEX idx_departures_trip_id ON trip_departures(trip_id);
CREATE INDEX idx_departures_start_date ON trip_departures(start_date);
CREATE INDEX idx_media_trip_id ON trip_media(trip_id);
CREATE INDEX idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- ============================================
-- SEED DATA (OPTIONAL - For Testing)
-- ============================================

-- Insert sample identity tags
INSERT INTO identity_tags (tag_name) VALUES
  ('Solo Traveler'),
  ('Adventure Seeker'),
  ('Nature Lover'),
  ('Group Explorer'),
  ('Peak Bagger'),
  ('Photography'),
  ('Off-road'),
  ('Monsoon Lover')
ON CONFLICT DO NOTHING;

-- Insert regions
INSERT INTO trip_regions (region_name) VALUES
  ('Karnataka'),
  ('Maharashtra'),
  ('Himachal Pradesh')
ON CONFLICT DO NOTHING;

-- ============================================
-- SECURITY: ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_departures ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin users to manage trips
CREATE POLICY "Admin users can view all trips"
  ON trips
  AS SELECT
  USING (
    (auth.jwt() ->> 'email') IN (
      SELECT email FROM admin_users WHERE role = 'admin'
    )
  );

CREATE POLICY "Admin users can update trips"
  ON trips
  AS UPDATE
  USING (
    (auth.jwt() ->> 'email') IN (
      SELECT email FROM admin_users WHERE role = 'admin'
    )
  );

-- Public can view published trips
CREATE POLICY "Public can view published trips"
  ON trips
  AS SELECT
  USING (status = 'published');

-- ============================================
-- NOTES:
-- ============================================
-- 1. Replace 'your_admin_email@example.com' with actual admin email
-- 2. Set up authentication users in Supabase Auth first
-- 3. Grant appropriate permissions based on user roles
-- 4. Remember to set up environment variables with these credentials:
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
--    - SUPABASE_SERVICE_ROLE_KEY

-- After running this SQL:
-- 1. Go to Supabase Auth > Users
-- 2. Create an admin user manual or use auth.signUp()
-- 3. Insert that user's ID into admin_users table with role='admin'
-- 4. Start the app and test login at /auth/login
