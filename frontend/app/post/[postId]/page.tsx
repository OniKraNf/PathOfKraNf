import PostPage from '@/components/PostPage';
import React from 'react';

const Page = ({ params }: {params: {postId: string}}) => {
  return (
    <div className='container text-white mt-20'>
        <PostPage postId={params.postId}/>
    </div>
  );
};



export default Page;