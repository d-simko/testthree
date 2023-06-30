"use client";

import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { toast } from "react-hot-toast";

import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";


interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  children,
  className,
}) => {


  const authModal = useAuthModal();
  const router = useRouter();

  const supabaseClient = useSupabaseClient();
  const { user } = useUser();
 
  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    ;
    router.refresh();
    // ToDO: Reset any playing song in future ... or whatever I have instead of songs .. example clips, or ... some sessions of anything !
    if (error) {
      toast.error(error.message);
    }
  }

  return (
    <div
      className={twMerge(`
        h-fit 
        bg-gradient-to-b 
        from-blue-900 
        p-6
        `,
        className
      )}>
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button 
            onClick={() => router.back()} 
            className="
              rounded-full 
              bg-slate-900
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-65 
              transition
            "
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button 
            onClick={() => router.forward()} 
            className="
              rounded-full 
              bg-slate-900
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-65 
              transition
            "
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button 
            onClick={() => router.push('/')} 
            className="
              rounded-full 
              p-2 
              bg-slate-200 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button 
            onClick={() => router.push('/search')} 
            className="
              rounded-full 
              p-2 
              bg-slate-200 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <BiSearch className="text-black" size={20} />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
        {user ? (
            <div className="flex gap-x-4 items-center">
              <Button 
                onClick={handleLogout} 
                className=" bg-slate-200  px-6 py-1"
              >
                Logout
              </Button>

              <Button 
                onClick={() => router.push('/account')} 
                className="bg-slate-200 "
              >
                <FaUserAlt />
              </Button>
            </div>
            ) : (
            <>
              <div>
                <Button 
                  onClick={authModal.onOpen} 
                  className="
                    bg-transparent 
                    text-slate-200 
                    font-medium
                  "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button 
                  onClick={authModal.onOpen} 
                  className="bg-slate-200 px-4 py-1"
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Header;


 
