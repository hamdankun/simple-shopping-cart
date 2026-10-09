import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useConfirmStore } from '@/stores/confirmStore'

export function ConfirmDialog() {
  const request = useConfirmStore((s) => s.request)
  const answer = useConfirmStore((s) => s.answer)

  // Keep showing the last question while the dialog fades out, so the text doesn't blank mid-animation.
  const [shown, setShown] = useState(request)
  if (request && request !== shown) setShown(request)

  return (
    <AlertDialog open={request !== null} onOpenChange={(open) => !open && answer(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{shown?.title}</AlertDialogTitle>
          <AlertDialogDescription>{shown?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => answer(true)}>{shown?.confirmLabel ?? 'Confirm'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
