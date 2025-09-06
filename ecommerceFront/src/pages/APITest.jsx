import React, { useState } from 'react';
import { authAPI } from '../services/api';

const APITest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing backend connection...');
    
    try {
      // Test basic backend connection
      const response = await fetch('http://localhost:5000/');
      const text = await response.text();
      setTestResult(prev => prev + '\n✅ Backend accessible: ' + text.substring(0, 50) + '...');
      
      // Test auth endpoint
      const authResponse = await authAPI.register({
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'testpass123'
      });
      
      setTestResult(prev => prev + '\n✅ Signup API working: ' + JSON.stringify(authResponse.data));
      
    } catch (error) {
      console.error('Test error:', error);
      setTestResult(prev => prev + '\n❌ Error: ' + (error.message || 'Unknown error'));
      
      if (error.response) {
        setTestResult(prev => prev + '\n❌ Response: ' + JSON.stringify(error.response.data));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
      <h2>API Connection Test</h2>
      <button 
        onClick={testBackendConnection} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {testResult && (
        <pre style={{
          background: 'white',
          padding: '1rem',
          marginTop: '1rem',
          borderRadius: '5px',
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap'
        }}>
          {testResult}
        </pre>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Current Configuration:</h3>
        <ul>
          <li>Frontend URL: http://localhost:5173</li>
          <li>Backend URL: http://localhost:5000</li>
          <li>API Base URL: http://localhost:5000/api</li>
        </ul>
      </div>
    </div>
  );
};

export default APITest;
