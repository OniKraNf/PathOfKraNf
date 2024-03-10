'use client';

import { certainPostLoad, deleteComment, likePost, loadPost, postComment } from "@/utils/SocialMethods";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useContext, useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { EvervaultCard, Icon } from "./ui/evervault-card";
import { Input2 } from "./ui/input2";
import { Button } from "./ui/button";
import AuthContext from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { TiDeleteOutline } from "react-icons/ti";
import { useRouter } from "next/navigation";

interface Post {
    id: number;
    username: string;
    title: string;
    description: string;
    image: string | null;
    verified: boolean;
    likes: number;
    created_at: string;
    updated_at: string | null;
    comments: Comment[];
}

interface User {
    user_id: number;
    groups: string[];
}

interface Comment {
    id: number;
    user_id: string;
    username: string;
    text: string;
    created_at: string;
}

const PostPage = ({postId} : {postId: string}) => {

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[] | null>(null);
    const commentRef = useRef<HTMLInputElement | null>(null);
    const {authTokens, logoutUser} = useContext(AuthContext);
    const {user} = useContext(AuthContext);
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await certainPostLoad(postId);
                setPost(postData.post);
                setComments(postData.comments);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [postId]);

    if (!authTokens) {
        console.warn('Auth tokens are not available.');
        return null;
    }

    const { access, refresh } = authTokens;

    const handleCommentSend = (access: string, post_id: number, text: string) => {
        const user : User = jwtDecode(access)
        console.log(user)
        const data = postComment(user.user_id, post_id, text);
    }

    const handleLikeClick = async (id: number, access: string | undefined, refresh: string | undefined) => {
        await likePost(id, access, refresh, logoutUser);
        const postData = await certainPostLoad(postId);
        setPost(postData.post);
    }

    const handleCommentDelete = async (comment_id: number) => {
        await deleteComment(comment_id)
        const postData = await certainPostLoad(postId);
        setPost(postData.post);
        setComments(postData.comments);
    }

    return (
        <div className="text-black flex justify-center items-center">
            {post ? 
            <div>
                <Card className='text-white bg-[#8a373700] max-w-[650px] min-w-[650px] border border-black/[0.2] dark:border-white/[0.2] flex flex-col rounded-md items-start justify-start relative mt-5'>
                    <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />
                    <CardHeader className='flex gap-2'>
                        <CardTitle className='flex flex-row items-center text-[16px]'>
                            <p><span className="cursor-pointer" onClick={() => router.push(`/profile/${post.username}/`)}>{post.username}</span> •&nbsp;</p>
                            <p> {formatDate(post.created_at)}</p>
                        </CardTitle>
                        <CardTitle className='text-2xl'>
                            <p>{post?.title}</p>
                        </CardTitle>
                        <CardDescription className='text-[#dbdbdb] text-xl'>{post?.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className='flex flex-row gap-5'>
                        <div onClick={() => handleLikeClick(post.id, access, refresh)} className='flex flex-row justify-center items-center gap-1'>
                            <FaRegHeart />
                            <p>{post?.likes}</p>
                        </div>
                        <div className='flex flex-row justify-center items-center gap-1'>
                            <FaRegComment />
                            <p>{comments?.length}</p>
                        </div>
                    </CardFooter>
                </Card>    
                <div className="flex items-center gap-3 mt-5 max-w-[650px]">
                    <Input2 ref={commentRef} placeholder="write your comment here" className="flex-1 w-full bg-black text-white py-2 px-4 border border-gray-300 rounded-md mr-3" />
                    <button type='submit' onClick={async () => {
                        const commentValue = commentRef.current?.value;
                        if (commentValue && access) {
                            handleCommentSend(access, post.id, commentValue)
                            const postData = await certainPostLoad(postId);
                            setComments(postData.comments)
                        }
                        }} className="text-[16px] h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                        Send
                    </button>
                </div>
                <div>   
                    {comments?.map((comment, index) => (
                        <div key={index} className="flex flex-col border border-black/[0.2] dark:border-white/[0.2] rounded-md items-start justify-start max-w-[650px] w-fit py-2 px-4 relative text-white mt-5 text-[14px]">
                            <p className="flex flex-row items-center"><span className="cursor-pointer" onClick={() => router.push(`/profile/${comment.username}/`)}>{comment.username}</span> • {formatDate(comment.created_at)} {user && user.groups && user.groups.includes('Admin') ? <TiDeleteOutline onClick={() => handleCommentDelete(comment.id)} className="ml-2" size={20}/> : <></>}</p>
                            <p>{comment.text}</p>
                        </div>
                    ))}
                </div>
            </div> 
            : <div></div>}
        </div>
    )
}

export default PostPage;