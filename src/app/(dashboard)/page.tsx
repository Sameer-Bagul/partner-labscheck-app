'use client'
// app/page.tsx
import isAuth from '@/components/auth/isAuth'
import { Spinner } from '@/components/ui/spinner'
import { redirect } from 'next/navigation'

 const Home = () => {

    
  redirect('/laboratory')
}

export default isAuth( Home );


