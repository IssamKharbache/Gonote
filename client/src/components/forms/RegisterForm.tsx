"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
import { Link } from "@tanstack/react-router";
import { UserPlus2Icon, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/actions/users/actions";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
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
    mutationFn: async (userData: signUpSchemaType) => {
      return await createUser(userData);
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Account created!",
        text: "Your account has been successfully created",
      });
      form.reset();
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: error.message || "Please check your information and try again",
      });
    },
  });

  const onSubmit = (data: signUpSchemaType) => {
    registerUser(data);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-blue-200 space-y-8 transition-colors duration-300"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mx-auto w-14 h-14 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
              <UserPlus2Icon className="text-white" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-light tracking-tight text-blue-900 dark:text-white">
            Create your account
          </h2>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Join Task Tide to streamline your workflow
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">
                      First name
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="John"
                          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400"
                          {...field}
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">
                      Last name
                    </FormLabel>
                    <FormControl>
                      <motion.div whileHover={{ scale: 1.01 }}>
                        <Input
                          placeholder="Doe"
                          className="focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400"
                          {...field}
                        />
                      </motion.div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">
                    Email
                  </FormLabel>
                  <FormControl>
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400"
                        {...field}
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-600 dark:text-blue-300 uppercase tracking-wider">
                    Password
                  </FormLabel>
                  <FormControl>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="relative"
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="type your password"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-blue-800 dark:border-blue-700 dark:text-white dark:placeholder-blue-400 text-xl pr-12"
                        style={{
                          paddingRight: "3rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 transition-colors cursor-pointer z-10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </motion.div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
              >
                {isPending ? "Creating account..." : "Create account"}
              </Button>
            </motion.div>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Already have an account?{" "}
            <Link to="/login">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-blue-800 dark:text-blue-200 font-medium hover:underline cursor-pointer"
              >
                Sign in
              </motion.span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
