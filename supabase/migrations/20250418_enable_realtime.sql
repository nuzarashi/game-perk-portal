
-- Function to enable Supabase Realtime for specified tables
CREATE OR REPLACE FUNCTION public.enable_realtime(table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set the replica identity to FULL for the specified table
  EXECUTE format('ALTER TABLE %I.%I REPLICA IDENTITY FULL', 'public', table_name);
  
  -- Add the table to the supabase_realtime publication
  EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I.%I', 'public', table_name);
END;
$$;
