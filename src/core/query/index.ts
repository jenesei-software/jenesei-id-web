import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000
    },
    mutations: {
      onError: error => {
        if (error) {
          console.error('Log. queryClient, error:', error.response?.data)
        }
      }
    }
  }
})
