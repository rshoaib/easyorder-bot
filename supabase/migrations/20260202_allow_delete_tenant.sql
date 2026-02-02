-- Allow store owners to delete their own tenant
CREATE POLICY "Owners can delete their own tenant"
ON tenants FOR DELETE
USING (auth.uid() = user_id);
