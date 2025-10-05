"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, type CustomerForm } from "@/app/login/validators/customer";
import { api } from "@/app/lib/axios";

export default function CustomerRegisterPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    criteriaMode: "firstError",
  });

  const onSubmit = async (values: CustomerForm) => {
    setServerMsg(null);

    const payload = {
      name: values.fullName,
      email: values.email,
      password: values.password,
    };

    try {
      const res = await api.post("/customer/register", payload, {
        headers: { "Content-Type": "application/json" },
      });
      setServerMsg(`✅ Registered: ${(res.data as any).name ?? "Success"}`);
      reset();
    } 
    
    catch (err: any) {
      const msg = err?.response?.data?.message ?? "Registration failed";
      setServerMsg(`❌ ${Array.isArray(msg) ? msg.join(", ") : msg}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Registration</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              className="w-full p-2 border rounded"
              {...register("fullName")}
              autoComplete="name"
              required
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              {...register("email")}
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              {...register("password")}
              autoComplete="new-password"
              required
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              {...register("confirmPassword")}
              autoComplete="new-password"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full bg-yellow-500 text-white py-2 rounded disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </form>

        {serverMsg && <p className="mt-3 text-sm">{serverMsg}</p>}
      </div>

    </div>
  );
}