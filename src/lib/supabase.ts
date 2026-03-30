import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kjrkqfwwixvapkhtssmh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqcmtxZnd3aXh2YXBraHRzc21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTA1NjYsImV4cCI6MjA4MDM2NjU2Nn0.tdZMt6_M_GjcCjATh-OwTx_14nN2JZutPpmOEw-Nkpc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
