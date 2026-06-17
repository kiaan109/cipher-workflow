"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem 1rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '0.75rem',
  color: '#fff', fontSize: 14,
  outline: 'none', transition: 'border-color 0.2s',
  fontFamily: "'Inter', sans-serif",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  letterSpacing: '0.06em', textTransform: 'uppercase',
  display: 'block', marginBottom: 6,
};

export function LoginForm() {
  const router = useRouter();
  const [socialPending, setSocialPending] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signInGithub = async () => {
    setSocialPending("github");
    await authClient.signIn.social({ provider: "github" }, {
      onSuccess: () => router.push("/workflows"),
      onError: (ctx) => { toast.error(ctx.error?.message ?? "Sign in failed"); setSocialPending(null); },
    });
  };

  const signInGoogle = async () => {
    setSocialPending("google");
    await authClient.signIn.social({ provider: "google" }, {
      onSuccess: () => router.push("/workflows"),
      onError: (ctx) => { toast.error(ctx.error?.message ?? "Sign in failed"); setSocialPending(null); },
    });
  };

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/workflows",
    }, {
      onSuccess: () => router.push("/workflows"),
      onError: (ctx) => { toast.error(ctx.error.message); },
    });
  };

  const isPending = form.formState.isSubmitting || !!socialPending;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '1.5rem', padding: '2.5rem',
      boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    }}>
      <h1 style={{
        fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
        fontSize: '2rem', color: '#fff', letterSpacing: '-0.02em',
        textAlign: 'center', marginBottom: 6,
      }}>Welcome back</h1>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '2rem' }}>
        Sign in to your Cipher account
      </p>

      {/* Social buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.75rem' }}>
        <button
          type="button"
          onClick={signInGithub}
          disabled={isPending}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.75rem',
            color: '#fff', fontSize: 14, fontWeight: 500,
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s, border-color 0.2s',
            opacity: isPending ? 0.6 : 1,
          }}
          onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'; }}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
        >
          {socialPending === 'github' ? (
            <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <Image alt="GitHub" src="/logos/github.svg" width={18} height={18} />
          )}
          Continue with GitHub
        </button>

        <button
          type="button"
          onClick={signInGoogle}
          disabled={isPending}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '0.75rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.75rem',
            color: '#fff', fontSize: 14, fontWeight: 500,
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            opacity: isPending ? 0.6 : 1,
          }}
          onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'; }}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
        >
          {socialPending === 'google' ? (
            <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <Image alt="Google" src="/logos/google.svg" width={18} height={18} />
          )}
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.75rem' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* Email form */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}.auth-input:focus{border-color:rgba(59,130,246,0.6)!important;box-shadow:0 0 0 3px rgba(59,130,246,0.1)!important;}`}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="auth-input"
              style={inputStyle}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p style={{ fontSize: 12, color: '#f87171', marginTop: 5 }}>{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="auth-input"
              style={inputStyle}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p style={{ fontSize: 12, color: '#f87171', marginTop: 5 }}>{form.formState.errors.password.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            width: '100%', padding: '0.875rem',
            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            border: 'none', borderRadius: '0.75rem',
            color: '#fff', fontSize: 15, fontWeight: 700,
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1,
            boxShadow: '0 0 30px rgba(59,130,246,0.3)',
            transition: 'opacity 0.2s, transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { if (!isPending) { (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 50px rgba(59,130,246,0.5)'; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px rgba(59,130,246,0.3)'; }}
        >
          {form.formState.isSubmitting ? 'Signing in...' : 'Sign in →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: '1.5rem' }}>
        No account?{' '}
        <Link href="/signup" style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: 600 }}>
          Create one free
        </Link>
      </p>
    </div>
  );
}
