"use client";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <ParticlesBackground />

      {/* Title and para */}
      <div>
        <h2 className="text-center text-4xl tracking-tight text-gray-900 dark:text-white">
          WELCOME
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to access your saved tools and preferences.
        </p>
        <span className="w-12 my-6 h-px flex bg-black/30 dark:bg-white/30 mx-auto"></span>
      </div>

      {/* Btn */}
      <Button
        onClick={() => signIn("google")}
        size="lg"
        className="mt-8 gap-3 rounded cursor-pointer z-50"
      >
        <img src="/google.svg" alt="google-icon" className="w-5" />
        Continue with Google
      </Button>
    </div>
  );
};

export default Login;
