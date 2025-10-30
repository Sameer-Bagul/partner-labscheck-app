
'use client'
import { useLogout } from "@/hooks/auth/use-auth"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"


type Props = {
  className?:string
  isOpen?: boolean | undefined;
}

export default function SignOutPage({className,isOpen}:Props) {
  const {mutate:logout } = useLogout()

  

  return (
    <div className={cn("w-full h-full max-w-xs flex gap-3 justify-center items-center",className )}
    onClick={() =>  logout()}>
      <LogOut className='text-2xl' />

     {isOpen && 'SignOut'}
    </div>
  )
}
