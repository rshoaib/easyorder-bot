'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send slug so backend knows which password to check
      await axios.post('/api/auth/login', { password, slug });
      router.push(`/store/${slug}/admin`);
      router.refresh();
    } catch (err) {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill for demo
  if (slug === 'demo' && !password) {
      setPassword('demo');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-2">
                <Lock size={20} />
            </div>
            <h1 className="text-xl font-bold">Admin Access</h1>
            <p className="text-gray-400 text-sm">Enter password for {slug}</p>
            {slug === 'demo' && <p className="text-blue-500 text-xs mt-1 font-medium bg-blue-50 px-2 py-1 rounded">Password is: <b>demo</b></p>}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Password"
              className="form-input text-center tracking-widest"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
