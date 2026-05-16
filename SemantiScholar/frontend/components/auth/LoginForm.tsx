import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { Button } from "@/components/ui";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", data);
      
      setAuth(response.data.data, response.data.data.token);
      
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          className="w-full h-10 rounded-xl border border-surface-200 bg-surface-50 px-3 text-sm text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-surface-800/50 dark:text-surface-100 dark:focus:ring-primary-900 transition-all outline-none"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-error">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          className="w-full h-10 rounded-xl border border-surface-200 bg-surface-50 px-3 text-sm text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-dark-border dark:bg-surface-800/50 dark:text-surface-100 dark:focus:ring-primary-900 transition-all outline-none"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-error">{errors.password.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign in
        </Button>
      </div>
    </form>
  );
}
