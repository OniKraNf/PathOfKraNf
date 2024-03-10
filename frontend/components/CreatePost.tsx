'use client';

import { cn } from '@/utils/cn';
import React, { useContext, useRef } from 'react'
import { Label2 } from './ui/label2';
import { Input2 } from './ui/input2';
import { IconBrandGithub, IconBrandGoogle, IconBrandOnlyfans } from '@tabler/icons-react';
import { TextArea } from './ui/textarea';
import { createPost } from '@/utils/SocialMethods';
import AuthContext from '@/context/AuthContext';
import { Icon } from './ui/evervault-card';
import { useRouter } from 'next/navigation';

interface User {
    user_id: number;
}

const CreatePost = () => {

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const inputTitleRef = useRef<HTMLInputElement | null>(null);
    // const imageRef = useRef<HTMLInputElement | null>(null);
    const {user} = useContext(AuthContext);
    const router = useRouter();

    const handleSendClick = async () => {
        // const imageFile = imageRef.current?.files?.[0];
        const user_id = user?.user_id;
        const title = inputTitleRef.current?.value;
        const content = textAreaRef.current?.value;

        if (user_id && title && content) {
            try {
                const data = await createPost(user_id, title, content);
                router.push(`/post/${data.id}`)
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <div>
            <div className="max-w-[700px] w-full mx-auto p-4 md:p-8 text-white bg-[#8a373700] border border-black/[0.2] dark:border-white/[0.2] rounded-md relative">
                <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Create Post
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Here you can create a post
                </p>
                <div className='flex flex-col gap-3'>
                    <LabelInputContainer>
                        <Label2 htmlFor="title">Title</Label2>
                        <Input2 placeholder='Your title' ref={inputTitleRef} className='bg-black' id="title" type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label2 htmlFor="content">Content</Label2>
                        <TextArea ref={textAreaRef} placeholder='Your text' className='bg-black h-[10rem]' id="content" />
                    </LabelInputContainer>
                    {/* <Input2 ref={imageRef} id='image' accept='post_images/*' type='file' className='pt-2 h-10 text-sm bg-black file:text-neutral-400 text-neutral-400'/> */}
                </div>
                <button
                className="mt-6 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                onClick={handleSendClick}>
                    Send &rarr;
                    <BottomGradient />
                </button>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            </div>
        </div>
    )
}

const BottomGradient = () => {
    return (
      <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      </>
    );
};

const LabelInputContainer = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
      </div>
    );
  };

export default CreatePost