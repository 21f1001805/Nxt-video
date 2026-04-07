"use client"
import { useRouter } from 'next/navigation';
import React, {useState} from 'react'

function RegisterPage() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword]= useState("");
    const router = useRouter();

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            alert("Passwords do not match")
            return;
        }

        try {
            const res= await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email, password
                })
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.error || "Registration Failed");
            }
            console.log(data);
            router.push("/login");

        } catch (error) {
            console.error(error);
        }
    }

    

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Register</h1>
      <p className="mt-1 text-sm text-slate-600">Create your account to upload videos to NXT Video.</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <input
        type="email" placeholder='Email' value={email}
        onChange={(e)=> setEmail(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
      />
      <input
        type="password" placeholder='Password' value={password}
        onChange={(e)=> setPassword(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
      />
      <input
        type="password" placeholder='Confirm Password' value={confirmPassword}
        onChange={(e)=> setConfirmPassword(e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
      />
      <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Register</button>
      </form>
      <div className="mt-4 text-sm text-slate-600">
        <p>Already have an account?  <a href="/login">Login</a></p>
      </div>
    </div>
    </div>
  )
}

export default RegisterPage
;
