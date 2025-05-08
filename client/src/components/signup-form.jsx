"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import signupSchema from "../schemas/signupSchema";
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
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SignupForm = () => {
  // zod functionaility
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      city: "",
      avatar: undefined,
    },
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("city", data.city);
      formData.append("avatar", data.avatar); // Add the file

      // API call
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Form Submitted:", response.data);
      form.reset();
      router.push("/login");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred during signup. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
            <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center  text-2xl font-bold">
            Welcome To Our Platform
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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

              {/* Password Field */}
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
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Jabalpur">Jabalpur</SelectItem>
                        <SelectItem value="Sagar">Sagar</SelectItem>
                        <SelectItem value="Indore">Indore</SelectItem>
                        <SelectItem value="Ujjain">Ujjain</SelectItem>
                        <SelectItem value="Gwalior">Gwalior</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Avatar Field */}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Avatar</FormLabel>
                    <FormControl className="form-control">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-center flex flex-col items-center space-y-2">
          <p className="text-md ">
            Already have an account ?{" "}
            <a
              href="/login"
              className="font-bold text-blue-500 hover:underline"
            >
              Login
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            By signing up, you agree to our terms and conditions.
          </p>
        </CardFooter>
      </Card>
      </div>

  );
};

export default SignupForm;
