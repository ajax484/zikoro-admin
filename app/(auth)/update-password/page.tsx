"use client";

import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputOffsetLabel from "@/components/InputOffsetLabel";
import { useState } from "react";
import { useUpdatePassword } from "@/hooks/services/auth";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormValue = {
  password: string;
};

export default function UpdatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, updatePassword } = useUpdatePassword();
  const form = useForm<FormValue>({});

  async function onSubmit(values: FormValue) {
    await updatePassword(values.password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9faff] px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="w-full mb-6 flex flex-col items-start justify-start gap-y-1">
          <h2 className="font-semibold text-2xl text-indigo-600 text-start">
            Reset Password
          </h2>
          <p className="text-slate-500 text-sm">Enter a new password.</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start w-full flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <InputOffsetLabel label="New Password">
                  <div className="relative h-12 w-full">
                    <Input
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="placeholder:text-sm h-12 focus:border-gray-500 placeholder:text-gray-200 text-gray-700 w-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowPassword((prev) => !prev);
                      }}
                      className="absolute right-3 inset-y-0 flex items-center"
                    >
                      {showPassword ? <EyeOff size={20} className="text-slate-400" /> : <Eye size={20} className="text-slate-400" />}
                    </button>
                  </div>
                </InputOffsetLabel>
              )}
            />

            <Button
              disabled={loading}
              className="mt-2 w-full gap-x-2 hover:bg-opacity-90 bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-lg font-medium flex items-center justify-center transition-colors"
            >
              {loading && <Loader size={20} className="animate-spin" />}
              <span>Reset Password</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
