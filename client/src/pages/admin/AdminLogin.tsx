import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/ui/SEO';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginError(null);
    try {
      const res = await api.post('/admin/login', data);
      if (res.data?.success) {
        if (res.data.data.token) {
          localStorage.setItem('codex_admin_token', res.data.data.token);
        }
        localStorage.setItem('codex_admin_user', JSON.stringify(res.data.data.user));
        navigate('/admin');
      } else {
        setLoginError(res.data?.error?.message || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.error?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <SEO title="Admin Sign In | Codex Tech-IT" />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6 hover:opacity-90 transition-opacity" title="Return to Codex Tech-IT Home">
            <img
              src="/assets/logo.svg"
              alt="Codex Tech-IT"
              width="180"
              height="50"
              className="h-11 w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="font-heading font-extrabold text-2xl text-navy-900">Admin Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorized Codex Tech-IT personnel only.
          </p>
        </div>

        {loginError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register('email')}
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-900 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
              />
            </div>
            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Verifying Credentials...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
