import { CircleAlertIcon, RotateCwIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/atoms/alert'
import { Button } from '@/components/atoms/button'
import { Spinner } from '@/components/atoms/spinner'

interface ErrorStateProps {
  title: string
  message: string
  onRetry?: () => void
  retrying?: boolean
}

export function ErrorState({ title, message, onRetry, retrying }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="animate-in fade-in">
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-2" onClick={onRetry} disabled={retrying}>
            {retrying ? <Spinner /> : <RotateCwIcon />}
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
