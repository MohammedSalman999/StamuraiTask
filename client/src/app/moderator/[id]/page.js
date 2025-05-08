import { redirect } from 'next/navigation'

export default function ModeratorRoot({ params }) {
  // Get the dynamic ID from URL
  const { id } = params

  // Redirect to /moderator/[id]/assign
  redirect(`/moderator/${id}/assign`)
}
