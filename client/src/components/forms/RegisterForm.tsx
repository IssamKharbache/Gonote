"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, signUpSchemaType } from "@/validations/validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "@tanstack/react-router";
import { UserPlus2Icon, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/actions/users/actions";
import Swal from "sweetalert2";
import { ApiError } from "./LoginForm";
import LoadingButton from "../loaders/LoadingButton";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  //
  const navigate = useNavigate();
  //
  const form = useForm<signUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Account created!",
        text: "Your account has been successfully created",
      });
      navigate({
        to: "/login",
      });
      form.reset();
      setPasswordChecks({
        length: false,
        uppercase: false,
        number: false,
        specialChar: false,
      });
    },
    onError: (error: ApiError) => {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.message || "Please check your internet and try again",
      });
    },
  });

  const onSubmit = (data: signUpSchemaType) => {
    registerUser(data);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordChecks({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[^A-Za-z0-9]/.test(value),
    });
    form.setValue("password", value, { shouldValidate: true });
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
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 dark:text-red-400 transition-opacity duration-200" />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        className="mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
            </div>

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
                        placeholder="type your password"
                        className="mt-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400 text-xl"
                        {...field}
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 dark:text-red-400" />

                  {/* Password strength hints */}
                  <div className="mt-2 text-xs space-y-1">
                    <div
                      className={`flex items-center ${passwordChecks.length ? "text-green-500" : "text-gray-500"}`}
                    >
                      {passwordChecks.length ? "✓" : "•"} At least 8 characters
                    </div>
                    <div
                      className={`flex items-center ${passwordChecks.uppercase ? "text-green-500" : "text-gray-500"}`}
                    >
                      {passwordChecks.uppercase ? "✓" : "•"} At least one
                      uppercase letter
                    </div>
                    <div
                      className={`flex items-center ${passwordChecks.number ? "text-green-500" : "text-gray-500"}`}
                    >
                      {passwordChecks.number ? "✓" : "•"} At least one number
                    </div>
                    <div
                      className={`flex items-center ${passwordChecks.specialChar ? "text-green-500" : "text-gray-500"}`}
                    >
                      {passwordChecks.specialChar ? "✓" : "•"} At least one
                      special character
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <LoadingButton type="submit" isLoading={isPending}>
              Create Account
            </LoadingButton>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-800 dark:text-blue-200 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
