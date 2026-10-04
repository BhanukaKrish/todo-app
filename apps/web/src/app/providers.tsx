import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from '@/components/atoms/sonner'
import { ApiError } from '@/lib/api-client'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Retrying a 4xx won't change the outcome; network/5xx errors get two retries.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status >= 400 && error.status < 500) &&
          failureCount < 2,
      },
    },
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </QueryClientProvider>
  )
}
