import React from 'react';
import { auth } from '@/auth';
import NavbarClient from './NavbarClient';

const Navbar = async() => {
    const session = await auth();
    console.log('Session:', session);
    const userId = session?.user?.id;
    
    return (
      <nav className="bg-gray-800 w-[80%] mx-auto my-10 rounded-xl shadow-xl   py-3 ">
        <div className="flex justify-between mx-20">
          <NavbarClient session={session} />
        </div>
      </nav>
    );
};

export default Navbar;