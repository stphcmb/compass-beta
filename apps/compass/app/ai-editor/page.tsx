import { redirect } from 'next/navigation'

// Redirect old AI Editor URL to new Research Assistant
export default function AIEditorRedirect() {
  redirect('/research-assistant')
}
