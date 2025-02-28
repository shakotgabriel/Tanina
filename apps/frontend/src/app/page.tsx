import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import DashboardPage from './(auth)/profile/page'
import type { User } from '@/types/auth.types'
import { Users } from '@tanina/types/users/users';

const users: Users[] = [];


export const metadata: Metadata = {
  title: 'Tanina - Dashboard',
  description: 'Your financial dashboard'
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <DashboardPage />
    </main>
  )
}