'use client';

import React, { useContext } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { toast, Toaster } from 'sonner';
import { ButtonsCard } from './ui/tailwindcss-buttons';
import { TextGenerateEffect } from './ui/text-generate-effect';
import AuthContext from '@/context/AuthContext';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

const Login = () => {

    const {loginUser} = useContext(AuthContext);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        } 
    })

    const handleSubmit =  async (formData: z.infer<typeof formSchema>) => {
        try {
            await loginUser(formData.email, formData.password);
        } catch (error) {
            console.error('Login failed: ', error);
        }
    }

    return (
        <div className='container mt-20 max-w-md'>
            <Form {...form}>
                <form className='flex flex-col gap-3' onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField 
                        control={form.control} 
                        name='email'
                        render={({field}) => {
                            return <FormItem className='flex flex-col mb-2'>
                                    <FormLabel className='text-white'>Email</FormLabel>
                                    <FormControl>
                                        <Input className='text-white' placeholder='Email' type='email' {...field} />
                                    </FormControl>
                                    <FormMessage/>
                            </FormItem>
                        }}/>
                    <FormField 
                    control={form.control} 
                    name='password'
                    render={({field}) => {
                        return <FormItem className='flex flex-col'>
                                <FormLabel className='text-white'>Password</FormLabel>
                                <FormControl>
                                    <Input className='text-white' placeholder='Password' type='password' {...field} />
                                </FormControl>
                                <FormMessage/>
                        </FormItem>
                    }}/>
                    <Toaster position='top-center'/>
                    <div className="flex justify-center w-full mt-5 mx-auto">
                        <button type='submit' className="w-full h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                            Login
                        </button>
                    </div>
                </form>
            </Form>
            <div className='pt-3'>
                <TextGenerateEffect className='text-[14px] text-center' specialHref='/sign-up' specialColor='text-blue-500' specialWords='Sign up here!' words=" Don't have an account?"/>
            </div>
        </div>
    )
}

export default Login