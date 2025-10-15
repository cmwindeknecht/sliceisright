"use client"

import { useState } from 'react';
import UserCreateForm from './UserCreateForm';
import UserLoginForm from './UserLogin';

export default function AdminMenuPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const handleToggle = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-full flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4 max-w-sm w-full px-4">
        <button
          onClick={handleToggle}
          className={`w-1/2 ${isLogin ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} text-white text-sm py-2 rounded disabled:opacity-50`}
        >
          {isLogin ? "Create New Account" : "Log in to Existing Account"}
        </button>
        {isLogin && <UserLoginForm />}
        {!isLogin && <UserCreateForm />}
      </div>
    </div>
  );
}