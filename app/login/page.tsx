"use client";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type OAuthProvider = {
  id: string;
  name: string;
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadProviders = async () => {
      const available = await getProviders();
      if (!available) return;

      const oauthOnly = Object.values(available)
        .filter((provider) => provider.id !== "credentials")
        .map((provider) => ({ id: provider.id, name: provider.name }));

      setProviders(oauthOnly);
    };

    void loadProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result.error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-600">Welcome back to NXT Video.</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
        />
        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Login
        </button>
      </form>
      <div className="mt-4 space-y-2">
        Don&apos;t have an account ?
        {providers.map((provider) => (
          <button key={provider.id} onClick={() => signIn(provider.id)} className="ml-2 rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100">
            Sign in with {provider.name}
          </button>
        ))}
        <button onClick={() => router.push("/register")} className="ml-2 rounded-md bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-800">Register</button>
      </div>
      </div>
    </div>
  );
}

export default LoginPage;
