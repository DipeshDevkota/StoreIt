"use client"

import { z } from "zod"
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"

// Define form type and schema
type FormType = "sign-in" | "sign-up"

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email({ message: "Invalid email address" }), // custom error message for email
    fullName: formType === "sign-up"
      ? z.string().min(2, { message: "Full name must be at least 2 characters" })
                .max(50, { message: "Full name must be 50 characters or less" })
      : z.string().optional(), // optional for "sign-in"
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errormessage, setErrormessage] = useState("")

  // Use the appropriate schema based on form type
  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      await form.trigger(); // Manually trigger validation to check if errors exist
      console.log(values);
    } catch (error) {
      console.log(form.formState.errors); // Log errors to see if validation is happening
      setErrormessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
        <h1 className="form-title">{type === "sign-in" ? "Sign In" : "Sign Up"}</h1>

        {/* Full Name Field (Only for Sign Up) */}
        {type === "sign-up" && (
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="shad-form-item">
                <FormLabel className="shad-form-label">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} className="shad-input" />
                </FormControl>
                <FormMessage className="shad-form-message" /> {/* Shows full name error if any */}
              </FormItem>
            )}
          />
        )}

        {/* Email Field */}
        <FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem className="shad-form-item">
      <FormLabel className="shad-form-label">Email</FormLabel>
      <FormControl>
        <Input placeholder="Enter your email" {...field} className="shad-input" />
      </FormControl>
      <FormMessage className="shad-form-message">
        {form.formState.errors.email?.message}
      </FormMessage> {/* Shows email error if any */}
    </FormItem>
  )}
/>

        {/* Submit Button */}
        <Button className="form-submit-button" type="submit" disabled={isLoading}>
          {isLoading ? (
            <Image 
              src="/assets/icons/loader.svg" 
              alt="loader"
              width={24}
              height={24}
              className="ml-2 animate-spin"
            />
          ) : (
            type === "sign-in" ? "Sign In" : "Sign Up"
          )}
        </Button>

        {/* Error Message */}
        {errormessage && <p className="error-message">*{errormessage}</p>}

        {/* Toggle Link */}
        <div className="body-2 flex justify-center">
          <p className="text-light-100">
            {type === "sign-in" ? "Don't have an account?" : "Already have an account?"}
          </p>
          <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className="ml-1 font-medium text-brand">
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default AuthForm
