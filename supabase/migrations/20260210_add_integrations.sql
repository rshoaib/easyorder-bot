-- Create Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'facebook', 'instagram', etc.
    access_token TEXT NOT NULL,
    page_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, provider)
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can view their own integrations
CREATE POLICY "Owners can view their own integrations" 
ON integrations FOR SELECT 
USING (
  auth.uid() = (
    SELECT user_id FROM tenants WHERE id = integrations.tenant_id
  )
);

-- Policy: Owners can manage their own integrations
CREATE POLICY "Owners can manage their own integrations" 
ON integrations FOR ALL 
USING (
  auth.uid() = (
    SELECT user_id FROM tenants WHERE id = integrations.tenant_id
  )
);
