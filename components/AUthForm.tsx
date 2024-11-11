"use client"

import { z } from "zod"
import Link from 'next/link';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Image from "next/image"
const formSchema = z.object({
  username: z.string().min(2).max(50),
})

type FormType = "sign-in" | "sign-up"

const AuthForm = ({ type }: { type: FormType }) => {

     const [isLoading,setIsLoading] = useState(false);
     const [errormessage,setErrormessage]= useState("")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  // Corrected onSubmit definition as an arrow function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <>
   <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
    <h1 className="form-title">{type === "sign-in" ? "Sign In" : "Sign Up"}</h1>
    {type === "sign-up" && (
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="shad-form-item">
            <div>
            <FormLabel className="shad-form-label">Full Name</FormLabel>
            
              </div>
            <FormControl>
              <Input placeholder="enter your full name" {...field}  className="shad-input"/>
            </FormControl>

            <FormMessage className="shad-form-message" />
          </FormItem>
        )}
      />

      
    )}
     <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="shad-form-item">
            <div>
            <FormLabel className="shad-form-label">Email</FormLabel>
            
              </div>
            <FormControl>
              <Input placeholder="enter your email" {...field}  className="shad-input"/>
            </FormControl>

            <FormMessage className="shad-form-message" />
          </FormItem>
        )}
      />
<Button className="form-submit-button" type="submit" disabled={isLoading}>
  {type === "sign-in" ? "Sign In" : "Sign Up"}
  {isLoading && (
    <Image 
  src="/assets/icons/loader.svg" 
  alt="loader"
  width={24}
  height={24}
  className="ml-2 animate-spin"
/>
  )}
</Button>
{errormessage && <p className="error-message">*{errormessage}</p>}
<div className="body-2 flex justify-center">
  <p className="text-light-100">
{type==="sign-in"?"Don't have an  account?":"Already have an account?"}
</p>
<Link href={type==="sign-in"?"/sign-up":"/sign-in"} className="ml-1 font-medium text-brand">
{" "}
{type ==="sign-in" ? "Sign-up":"Sign In"}</Link>
</div>
  </form>
</Form>


    {/* OTP Verification */}
    </>
  )
}

export default AuthForm
