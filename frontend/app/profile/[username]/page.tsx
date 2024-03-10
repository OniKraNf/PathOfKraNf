import UserProfile from '@/components/UserProfile'
import React from 'react'

const page = ({params}: {params: {username: string}}) => {
    return (
        <div className='container mt-20'>
            <UserProfile username={params.username}/>
        </div>
    )
}

export default page