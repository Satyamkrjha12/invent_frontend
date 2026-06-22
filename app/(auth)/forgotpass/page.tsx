import React from 'react'
import AuthBanner from '@/components/auth/AuthBanner'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function page() {
  return (
    <div className="min-h-screen bg-[#FFFAF7]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col-reverse lg:flex-row">

        {/* Banner */}
        <div className="w-full lg:w-1/2">
          <AuthBanner />
        </div>

        {/* Form */}
        <div className="flex w-full items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-10">
        <ForgotPasswordForm />
        </div>

      </div>
    </div>
  )
}
