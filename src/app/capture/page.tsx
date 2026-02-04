import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import CaptureClient from './CaptureClient'

export default async function CapturePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/capture')
  }

  return (
    <CaptureClient
      name={session.user.name}
      email={session.user.email}
      image={session.user.image}
      provider={(session as { provider?: string }).provider}
    />
  )
}
