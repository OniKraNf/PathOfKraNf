'use client';

import { cn } from '@/utils/cn';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useRef, useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Profile {
    username: string;
    image: string;
    bio: string;
}

const FindProfile = () => {

    const [profilesData, setProfilesData] = useState<Profile[] | null>(null);
    const searchText = useRef<HTMLInputElement | null>(null);

    const getProfilesData = async () => {
        try {
            let url = 'http://localhost:8000/api/profiles/';

            if (searchText != null) {
                url = `http://localhost:8000/api/profiles/search/?username=${searchText.current?.value}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            
            if (response.ok) {
                const data = await response.json();
                setProfilesData(data);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <div className='flex flex-col justify-center items-center mt-20 text-3xl'>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-white'>Find</h1>
                    <LabelInputContainer>
                        <div className='flex flex-row gap-3 mt-5'>
                            <Input ref={searchText} placeholder='Username' className='bg-black text-white w-[250px] flex-none' />
                            <button type='submit' onClick={getProfilesData} className="text-[16px] h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                Search
                            </button>
                        </div>
                    </LabelInputContainer>
                </div>
                <div className='mt-10'>
                    {profilesData ? 
                        <div className='flex flex-wrap gap-5 mb-5'>
                            {profilesData.map((profile, index) => (
                            <Card key={index} className='text-white bg-[#8a373700] max-w-[250px] min-w-[250px] border border-black/[0.2] dark:border-white/[0.2] flex flex-col rounded-md items-start justify-start relative'>
                                <CardHeader>
                                    <CardTitle className='text-2xl'>{profile.username}</CardTitle>
                                    <CardDescription>{profile.bio}</CardDescription>
                                </CardHeader>
                            </Card>
                            ))}
                        </div>
                         : 
                        <>
                        </>
                    }
                </div>
            </div>
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

export default FindProfile