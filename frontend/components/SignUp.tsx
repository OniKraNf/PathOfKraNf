import React, { useContext, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { TextGenerateEffect, TextGenerateNormalEffect } from './ui/text-generate-effect';
import AuthContext from '@/context/AuthContext';

const formSchema = z.object({
    username: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirm: z.string(),
}).refine((data) => {
    return data.password === data.passwordConfirm
}, {
    message: 'Passwords do not match',
    path: ['passwordConfirm']
})

const Register = () => {

    const { registerUser } = useContext(AuthContext);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
        }
    })

    const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
        try {
            await registerUser(formData.email, formData.username, formData.password, formData.passwordConfirm);
        } catch (error: any) {
            console.error('Registration failed: ', error);
            setErrorMessage("Username or email is already taken");
        }
    }

    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div className="container mt-20 max-w-md">
            <Form {...form}>
                <form className='flex flex-col w-full gap-3' onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name='username' 
                        render={({field}) => {
                            return <FormItem className='flex flex-col'>
                                <FormLabel className='text-white'>Username</FormLabel>
                                <FormControl>
                                    <Input className='text-white' placeholder='Username' type='username' {...field}/>
                                </FormControl>
                                <FormMessage/>
                                {errorMessage && <TextGenerateNormalEffect words={errorMessage} className="text-red-500 text-[12px]"></TextGenerateNormalEffect>}
                            </FormItem>
                    }}/>
                    <FormField
                        control={form.control}
                        name='email' 
                        render={({field}) => {
                            return <FormItem className='flex flex-col'>
                                <FormLabel className='text-white'>Email</FormLabel>
                                <FormControl>
                                    <Input className='text-white' placeholder='Email' type='email' {...field}/>
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
                                    <Input className='text-white' placeholder='Password' type='password' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                    }}/>
                    <FormField
                        control={form.control}
                        name='passwordConfirm' 
                        render={({field}) => {
                            return <FormItem className='flex flex-col'>
                                <FormLabel className='text-white'>Password confirm</FormLabel>
                                <FormControl>
                                    <Input className='text-white' placeholder='Password confirm' type='password' {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                    }}/>
                    <div className="flex justify-center w-full mt-5 mx-auto">
                        <button type='submit' className=" w-full h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                            Sign Up
                        </button>
                    </div>
                </form>
            </Form>
            <div className='pt-3'>
                <TextGenerateEffect className='text-[14px] text-center' specialHref='/login' specialColor='text-blue-500' specialWords='Sign in here!' words='Already have an account?'/>
            </div>
        </div>
    )
}

export default Register