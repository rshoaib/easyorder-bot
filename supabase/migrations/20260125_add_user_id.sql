-- Add user_id column to tenants table to link with Supabase Auth
ALTER TABLE tenants ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Enable Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Policy: Tenants can be viewed by everyone (for the storefront)
CREATE POLICY "Public tenants are viewable by everyone" 
ON tenants FOR SELECT 
USING (true);

-- Policy: Tenants can be created by authenticated users
CREATE POLICY "Users can create their own tenant" 
ON tenants FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Policy: Tenants can only be updated by the owner
CREATE POLICY "Users can update their own tenant" 
ON tenants FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy: Tenants can only be deleted by the owner
CREATE POLICY "Users can delete their own tenant" 
ON tenants FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create an index for faster lookups
CREATE INDEX idx_tenants_user_id ON tenants(user_id);
