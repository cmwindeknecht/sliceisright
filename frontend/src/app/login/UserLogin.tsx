"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/Auth";
import { useRouter } from "next/navigation";

const UserLoginForm = () => {
  const { loginByEmail, loading, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load email from localStorage if it exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    const result = await loginByEmail(email, password);
    if (result.success) {
      if (result.data?.entity.isAdmin) {
        router.push("/admin/order");
      } else {
        router.back();
      }

      setSuccess(true);
      setPassword("");

      if (rememberEmail) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
        setEmail("");
      }
    } else {
      setError(result.error ?? "Registration failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email ?? ""}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        autoComplete={rememberEmail ? "email" : "off"}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password ?? ""}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        autoComplete="new-password"
        required
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={rememberEmail}
          onChange={(e) => setRememberEmail(e.target.checked)}
          disabled={loading}
        />
        Remember my email
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center">Logged in successfully!</p>}
    </form>
  );
};

export default UserLoginForm;
