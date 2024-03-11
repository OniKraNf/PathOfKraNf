'use client';

import React, { useState } from 'react'
import { HoveredLink, Menu, MenuItem, ProductItem } from './ui/navbar-menu'
import { cn } from '../utils/cn'

const Header = () => {
  return (
    <div className='relative w-full flex items-center justify-center'>
      <Navbar/>
    </div>
  )
}

const Navbar = ({ className } : { className?: string }) => {

  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn('w-full inset-x-0 z-50', className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item='Home'>
          <div className='flex flex-col text-sm'>
            <HoveredLink href='/'>To Home</HoveredLink>
          </div>
        </MenuItem> 
        <MenuItem setActive={setActive} active={active} item="Economy">
          <div className='flex flex-col space-y-4 text-sm'>
            <HoveredLink href='/economy'>Economy</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item='Trade'>
          <div className='flex flex-col text-sm'>
            <HoveredLink href='/find-help'>Find help</HoveredLink>
            <HoveredLink href='/create-post'>Create post</HoveredLink>
          </div>
        </MenuItem> 
        <MenuItem setActive={setActive} active={active} item='Profile'>
          <div className='flex flex-col text-sm gap-2'>
            <HoveredLink href='/profile'>Your profile</HoveredLink>
            <HoveredLink href='/find'>Find profile</HoveredLink>
          </div>
        </MenuItem> 
      </Menu>
    </div>
  );
}

export default Header;