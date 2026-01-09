'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import axios from 'axios';

export default function SuperAdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Login without slug = Super Admin check
      await axios.post('/api/auth/login', { password });
      router.push(`/super-admin`);
      router.refresh();
    } catch (err) {
      setError('Invalid master password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                <ShieldAlert size={24} />
            </div>
            <h1 className="text-xl font-bold">Platform Admin</h1>
            <p className="text-gray-400 text-sm">Restricted Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Master Password"
              className="form-input text-center tracking-widest bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full bg-gray-900 hover:bg-black"
          >
            {loading ? 'Verifying...' : 'Access Platform'}
          </button>
        </form>
      </div>
    </div>
  );
}
