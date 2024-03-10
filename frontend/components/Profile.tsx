'use client';

import { jwtDecode } from 'jwt-decode';
import React, { Dispatch, RefAttributes, SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { Input } from './ui/input';
import { Input2 } from './ui/input2';
import { Label } from './ui/label';
import { Label2 } from './ui/label2';
import { DirectionAwareHover } from './ui/direction-aware-hover';
import Image from 'next/image'
import { cn } from '@/lib/utils';
import { SparklesCore } from './ui/sparkles';
import { useRouter } from 'next/navigation'

interface DecodedToken {
    username: string;
}

interface User {
    id: number;
    username: string;
    email: string;
}

interface UserProfile {
    id: number;
    username: number;
    full_name: string;
    bio: string;
    image: string;
    verified: boolean;
}

const Profile = () => { 
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bioInputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const token = localStorage.getItem('authTokens')
    const [decoded_data, setDecodedData] = useState<DecodedToken | null>()
    const [isLoaded, setLoading] = useState(false)
    const [isChange, setChange] = useState(false)
    const router = useRouter();
    

    useEffect(() => {
        const fetch = async () => {
            if (token) {
                setDecodedData(jwtDecode(token))
                const decodedToken : DecodedToken = jwtDecode(token)
                const data = await getUserProfile(decodedToken.username)
                setProfileData(data)
            }
            setLoading(true)
        }
        fetch();
    }, [token])

    const changeHandleClick = () => {
        setChange(!isChange);
    }

    const avatarHandleClick = () => {
        if (avatarInputRef.current) {
            avatarInputRef.current.click();
        }
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const avatar = event.target.files?.[0];
        if (avatar) {
            const imageURL = URL.createObjectURL(avatar);
            setImageUrl(imageURL);
        }
    };

    const handleSaveClick = async () => {
        const avatarFile = avatarInputRef.current?.files?.[0];
        const bio = bioInputRef.current?.value;
    
        const formData = new FormData();
    
        if (avatarFile) {
            formData.append('image', avatarFile, avatarFile.name);
        }
    
        if (typeof bio === 'string') {
            formData.append('bio', bio);
        }
        
        if (avatarFile != null || bio != null) {
            try {
                const response = await fetch(`http://0.0.0.0:8000/api/profile/${profileData?.username}/`, 
                {
                    method: 'PATCH',
                    headers: {
                    },
                    body: formData
                });
    
            } catch (error) {
                console.error('Error saving avatar:', error);
            }

            window.location.reload();        

        }

    }

    return (
        <div className='w-full flex flex-col items-center justify-center overflow-hidden rounded-md'>
            { profileData && isLoaded  ? 
                <div>
                { !isChange ? 
                    <div className='flex flex-col justify-center items-center'>
                        <div className="w-[40rem] h-[19.2rem] absolute">
                            {/* Gradients */}
                            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                    
                            {/* Core component */}
                            <SparklesCore
                                background="transparent"
                                minSize={0.4}
                                maxSize={1}
                                particleDensity={1200}
                                className="w-full h-full"
                                particleColor="#FFFFFF"
                                />
                    
                            {/* Radial Gradient to prevent sharp edges */}
                            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_300px_at_top,transparent_20%,white)]"></div>
                        </div>
                        <div className='h-auto z-20'>
                            <div>
                                <Image width={130} height={130} className='rounded-[100px]' src={'/avatars/default.jpg'} alt={''} />
                            </div>
                            <h1 className='mt-3 md:text-4xl text-2xl lg:text-2xl font-bold text-center text-white relative z-20'>
                            { profileData && isLoaded ? "@" + profileData.username : '' }
                            </h1>
                            <div className='justify-center text-center'>
                                <p className='text-xl'>{profileData?.bio}</p>
                            </div>
                            <div className='flex justify-center mt-5'>
                                <button onClick={changeHandleClick} className="mb-2 flex h-9 w-25 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                    Change
                                </button>
                            </div>
                        </div>  
                    </div> : 
                    <div className='flex flex-col justify-center items-center'>
                        <div className="absolute w-[40rem] h-[30.7rem]">
                            {/* Gradients */}
                            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                    
                            {/* Core component */}
                            <SparklesCore
                                background="transparent"
                                minSize={0.4}
                                maxSize={1}
                                particleDensity={1200}
                                className="w-full h-full"
                                particleColor="#FFFFFF"/>
                    
                            {/* Radial Gradient to prevent sharp edges */}
                            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_600px_at_top,transparent_20%,white)]"></div>
                        </div>
                        <div className='flex flex-col justify-center items-center gap-3 z-20'>
                            <div onClick={avatarHandleClick}>
                                <DirectionAwareHover className='border-white border-2' width={200} height={200} imageUrl={'/avatars/default.jpg'}>
                                    <p className='font-bold text-sm'>Upload your avatar</p>
                                    <p className="font-normal text-sm">just click</p>
                                </DirectionAwareHover>
                            </div>
                            <div className='mt-2 flex flex-col gap-3'>
                                <Label htmlFor='avatar'>Avatar</Label>
                                <Input ref={avatarInputRef} onChange={handleAvatarChange} id='avatar' accept='user_images/*' type='file' className='w-[200px] pt-2 h-10 text-sm bg-black file:text-neutral-400 text-neutral-400'/>
                                <LabelInputContainer>
                                    <Label2 htmlFor='aboutme'>About me</Label2>
                                    <Input2 ref={bioInputRef} className='bg-black' id='aboutme' placeholder='About me' type='text'/>
                                </LabelInputContainer>
                                <div className="flex justify-center w-full mt-5 mx-auto gap-5">
                                    <button onClick={changeHandleClick} className="mb-3 w-full h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                        Back
                                    </button>
                                    <button type='submit' onClick={handleSaveClick} className="w-full h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                        Save
                                    </button>
                                </div>
                        </div>
                    </div>
                </div> 
                }
            </div> 
            : <></>
            }
        </div>
    )
}

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

const getUserProfile = async (username: string) => {
    try {
        const response = await fetch(`http://0.0.0.0:8000/api/profile/${username}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            const userProfile = await response.json();
            return userProfile;
        } else {
            throw new Error("Error retrieving user profile");
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Error fetching user profile");
    }
}

export default Profile