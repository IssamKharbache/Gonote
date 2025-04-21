"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "@/validations/validation";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Link, redirect } from "@tanstack/react-router";
import { UserPlus2Icon, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/actions/users/actions";
import Swal from "sweetalert2";
import LoadingButton from "../loaders/LoadingButton";

export interface ApiError {
  response?: {
    status: number;
    statusText: string;
    data: {
      error?: string;
    };
  };
  message?: string;
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Logged in!",
        text: "You've successfully logged in",
      });

      form.reset();
    },
    onError: (error: ApiError) => {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error.message || "Please check your information and try again",
      });
    },
  });

  const onSubmit = (data: loginSchemaType) => {
    mutate(data);
  };
  return (
    <div className="flex items-center justify-center px-4 py-12 ">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-blue-200 space-y-8 ">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <div className="mx-auto w-14 h-14 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
              <UserPlus2Icon className="text-white ml-1.5" size={25} />
            </div>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-blue-900 dark:text-white">
            Create your account
          </h2>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Join Task Tide to streamline your workflow
          </p>
        </div>

        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Type your password"
                        className="mt-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400 text-xl"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-[29px] -translate-y-1/2 flex items-center justify-center text-blue-500 dark:text-blue-300 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <LoadingButton type="submit" isLoading={isPending}>
              Login
            </LoadingButton>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-800 dark:text-blue-200 font-medium hover:underline"
            >
              Join us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
