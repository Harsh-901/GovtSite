// Test script to verify Supabase storage configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://djnhdraoijkxsrxgatht.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbmhkcmFvaWpreHNyeGdhdGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTc2MjIsImV4cCI6MjA4NTc3MzYyMn0.bO7-luJxCw7hySoGzonF_Q0njPou7F5bzvgeV6W5cIQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testStorageSetup() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test if we can list buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return
    }
    
    console.log('Available buckets:', buckets.map(b => b.name))
    
    // Check if documents bucket exists
    const documentsBucket = buckets.find(b => b.name === 'documents')
    if (!documentsBucket) {
      console.error('Documents bucket not found!')
      return
    }
    
    console.log('Documents bucket found:', documentsBucket)
    
    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Current user:', user ? user.id : 'Not authenticated')
    
    console.log('✅ Storage setup test completed')
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testStorageSetup()