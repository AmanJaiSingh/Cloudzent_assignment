"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    teamName: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/signup", formData);
      router.push("/login");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Unable to connect to the server. Please check your connection.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-neutral-900 p-8 shadow-xl ring-1 ring-neutral-200 dark:ring-neutral-800"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Join your team to manage incidents.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <Input
                id="name"
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="teamName" className="sr-only">Department</label>
              <select
                id="teamName"
                required
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-50 dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-900 transition-all appearance-none [&>option]:text-neutral-900 dark:[&>option]:bg-neutral-900 dark:[&>option]:text-neutral-50"
                value={formData.teamName}
                onChange={handleChange}
              >
                <option value="" disabled className="text-neutral-400 dark:text-neutral-500">Select Department</option>
                <option value="Backend Engineering">Backend Engineering</option>
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="DevOps / Infrastructure">DevOps / Infrastructure</option>
                <option value="QA / Testing">QA / Testing</option>
                <option value="Security">Security</option>
                <option value="Data Engineering">Data Engineering</option>
                <option value="Site Reliability Engineering (SRE)">Site Reliability Engineering (SRE)</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-neutral-900 dark:text-white hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
