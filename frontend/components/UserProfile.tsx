'use client';

import { certainProfile } from '@/utils/SocialMethods';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface Profile {
    username: string;
    bio: string;
}

const UserProfile = ({username}: {username: string}) => {
    
    const [profile, setProfile] = useState<Profile>();

    useEffect(() => {
        const fetchData = async () =>{
            const profileData = await certainProfile(username);
            setProfile(profileData)
        }

        fetchData();
    }, [])

    return (
        <div className='flex flex-col justify-center items-center'>   
            <div className='text-white bg-[#8a373700] max-w-[250px] min-w-[250px] p-5 border border-black/[0.2] dark:border-white/[0.2] flex flex-col rounded-md items-center justify-center relative'>
                <Image width={130} height={130} className='rounded-[100px]' src={'/avatars/default.jpg'} alt={''} />
                <p className='text-3xl mt-2'>{profile?.username}</p>
                <p>{profile?.bio}</p>
            </div>
        </div>
    )
}

export default UserProfile