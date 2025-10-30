'use client'

import Link from 'next/link'
import { ContentLayout } from '@/components/layout/contentLayout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import PlaceholderContent from '@/components/layout/placeholder'
import AllLabs from '@/components/dashboard/labs/allLabs'
import { Button } from '@/components/ui/button'
import isAuth from '@/components/auth/isAuth'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/auth-Provider'
import { getCurrentSubscription } from '@/app/api/subscribe/route'

const PostsLaboratoryPage = () => {
  const [visible, setVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const partnerId = user?.id

  async function checkSubscription() {
    if (!partnerId) return
    try {
      setIsLoading(true)
      const res = await getCurrentSubscription(partnerId.toString())
      if ((res as { status?: string })?.status === 'active') {
        setVisible(false)
      }
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    checkSubscription();
  }, [])

  return (
    <ContentLayout title='All Laboratories'>
      {/* Premium banner */}
      {visible && !isLoading && (
        <Card className='mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 p-0 shadow-lg hover:shadow-xl transition-all duration-300'>
          <CardContent className='flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-6'>
            <div className='flex items-center gap-3 text-sm md:text-base'>
              <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center'>
                <span className='text-white text-lg font-bold'>✨</span>
              </div>
              <div>
                <span className='font-bold text-purple-900 block'>Upgrade to Premium</span>
                <span className='text-gray-700'>
                  Reach <strong className='text-purple-700'>3x more customers</strong> with priority placement
                </span>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Link href='/subscription'>
                <Button 
                  className='btn-primary text-sm px-6 py-2'
                >
                  Subscribe Now
                </Button>
              </Link>
              <button
                onClick={() => setVisible(false)}
                className='text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-lg hover:bg-purple-100'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Breadcrumb and Add New Lab */}
      <div className='flex justify-between items-center mb-6 flex-wrap gap-4'>
        <Breadcrumb className='bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-100'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/' className='text-gray-600 hover:text-purple-600 transition-colors'>
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-purple-700 font-semibold'>Laboratory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Link href={'/laboratory/new'}>
          <Button className='btn-primary text-sm px-6 py-2 shadow-md hover:shadow-lg'>
            + Add New Lab
          </Button>
        </Link>
      </div>

      <PlaceholderContent>
        <AllLabs />
      </PlaceholderContent>
    </ContentLayout>
  )
}

export default isAuth(PostsLaboratoryPage)
