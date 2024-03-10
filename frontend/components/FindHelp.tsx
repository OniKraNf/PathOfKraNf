'use client';

import React, { useContext, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { formatDistanceToNow } from 'date-fns';
import { formatDate } from '@/utils/formatDate';
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { likePost, loadPost } from '@/utils/SocialMethods';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Icon } from './ui/evervault-card';

interface Post {
    id: number;
    username: string;
    title: string;
    description: string;
    image: string | null;
    verified: boolean;
    likes: number;
    count_comments: number;
    created_at: string;
    updated_at: string | null;
}



const FindHelp = () => {

    const [postData, setPostData] = useState<Post[] | null>(null);
    const {authTokens, logoutUser} = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/post/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setPostData(data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchRequest()
    }, [])

    const handleLikeClick = async (id: number, access: string | undefined, refresh: string | undefined) => {
        await likePost(id, access, refresh, logoutUser);
        setPostData(await loadPost());
    }

    const navigateToPostPage = (postId: number) => {
        router.push(`/post/${postId}`)
    };

    return (
        <div>
            <div className='text-white flex justify-center text-3xl'>
                <h1>Find Help</h1>
            </div>
            <div>
                {postData ? 
                <div className='flex flex-col justify-center items-center gap-5 mt-10'>
                    {postData.map((post, index) => (
                        <Card key={index} className='text-white bg-[#8a373700] max-w-[650px] min-w-[650px] border border-black/[0.2] dark:border-white/[0.2] flex flex-col rounded-md items-start justify-start relative'>
                            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
                            <CardHeader onClick={() => navigateToPostPage(post.id)} className='flex gap-2'>
                                <CardTitle className='flex flex-row items-center text-[14px]'>
                                    <p>{post.username} •&nbsp;</p>
                                    <p> {formatDate(post.created_at)}</p>
                                </CardTitle>
                                <CardTitle className='text-xl'>
                                    <p>{post.title}</p>
                                </CardTitle>
                                <CardDescription className='text-[#dbdbdb]'>{post.description}</CardDescription>
                            </CardHeader>
                            {post.image ?  
                                <CardContent>
                                    <img src={post.image}></img>
                                </CardContent> : <></>
                            }
                            <CardFooter className='flex flex-row gap-5'>
                                <div onClick={() => handleLikeClick(post.id, authTokens?.access, authTokens?.refresh)} className='flex flex-row justify-center items-center gap-1'>
                                    <FaRegHeart />
                                    <p>{post.likes}</p>
                                </div>
                                <div className='flex flex-row justify-center items-center gap-1'>
                                    <FaRegComment />
                                    <p>{post.count_comments}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div> :
                <><p></p></>}
            </div>
        </div>
    )
}

export default FindHelp