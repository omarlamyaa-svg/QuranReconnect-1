import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ixwxvwamxvltgutgocwy.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4d3h2d2FteHZsdGd1dGdvY3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDc0MTcsImV4cCI6MjA4MzcyMzQxN30.qvzjq-B6C_yU8pFN7BLU1Lp9XhfD1pPQon1OfuyJb3w'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4d3h2d2FteHZsdGd1dGdvY3d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE0NzQxNywiZXhwIjoyMDgzNzIzNDE3fQ.DZNL01qlRnP6elqEyFuEBXG9YviNAdoyRQfcDB9wZhw'

// Client for browser/public use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
