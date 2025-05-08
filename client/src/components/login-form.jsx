"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://stamuraitask.onrender.com/users/login",
        data,
        {
          withCredentials: true,
        }
      );
      console.log("Login Successful:", response.data);
      const { user, accessToken } = response.data;

      // Store user data and token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);

      // Redirect based on user Role
      if (user.role === "admin") {
        router.push(`/admin/${user.id}`);
      } else if (user.role === "user") {
        router.push(`/user/${user.id}`);
      } else {
        router.push(`/moderator/${user.id}`);
      }
      toast.success(`Welcome ${user.name}`);
    } catch (error) {
      console.error("Login Failed:", error);
      setError("Login failed. Please check your credentials and try again.");
      toast.warning(`Login failed For ${user.name}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center ">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm ">
            New to this app?{" "}
            <a
              href="/signup"
              className="font-bold text-blue-500 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
