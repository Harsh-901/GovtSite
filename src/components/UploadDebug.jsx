import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function UploadDebug({ user }) {
  const [testResult, setTestResult] = useState('')
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    setTestResult('Running tests...\n')
    
    try {
      // Test 1: Check Supabase connection
      setTestResult(prev => prev + '1. Testing Supabase connection...\n')
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        setTestResult(prev => prev + `❌ Buckets error: ${bucketsError.message}\n`)
        return
      }
      
      setTestResult(prev => prev + `✅ Found ${buckets.length} buckets: ${buckets.map(b => b.name).join(', ')}\n`)
      
      // Test 2: Check documents bucket
      const documentsBucket = buckets.find(b => b.name === 'documents')
      if (!documentsBucket) {
        setTestResult(prev => prev + '❌ Documents bucket not found!\n')
        return
      }
      
      setTestResult(prev => prev + '✅ Documents bucket exists\n')
      
      // Test 3: Check user authentication
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        setTestResult(prev => prev + `❌ Auth error: ${authError.message}\n`)
        return
      }
      
      setTestResult(prev => prev + `✅ User authenticated: ${currentUser?.id || 'No user'}\n`)
      
      // Test 4: Try to create a test file
      if (currentUser) {
        setTestResult(prev => prev + '4. Testing file upload...\n')
        
        const testFile = new Blob(['Test content'], { type: 'text/plain' })
        const fileName = `${currentUser.id}/test_${Date.now()}.txt`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, testFile)
        
        if (uploadError) {
          setTestResult(prev => prev + `❌ Upload error: ${uploadError.message}\n`)
          return
        }
        
        setTestResult(prev => prev + `✅ Test file uploaded: ${uploadData.path}\n`)
        
        // Clean up test file
        await supabase.storage.from('documents').remove([fileName])
        setTestResult(prev => prev + '✅ Test file cleaned up\n')
      }
      
      setTestResult(prev => prev + '\n🎉 All tests passed! Upload should work.\n')
      
    } catch (error) {
      setTestResult(prev => prev + `❌ Unexpected error: ${error.message}\n`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Upload Debug Tool</h3>
      <p className="text-sm text-yellow-700 mb-4">
        Use this tool to diagnose upload issues. Click the button below to run diagnostic tests.
      </p>
      
      <button
        onClick={runTests}
        disabled={testing}
        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:opacity-50 mb-4"
      >
        {testing ? 'Running Tests...' : 'Run Upload Tests'}
      </button>
      
      {testResult && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
          {testResult}
        </div>
      )}
    </div>
  )
}