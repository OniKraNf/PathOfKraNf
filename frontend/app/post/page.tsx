import PostList from '@/components/PostPage';
import React from 'react'

const page = ({ params }: {params: {postId: string}}) => {
    return (
        <div className='container'>
            <PostList postId={params.postId}/>
        </div>
    )
}

export default page