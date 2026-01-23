import { redirect } from 'next/navigation'

// Redirect old AI Editor results URL to new Research Assistant results
export default function AIEditorResultsRedirect({ params }: { params: { id: string } }) {
  redirect(`/research-assistant/results/${params.id}`)
}
