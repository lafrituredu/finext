import { useTransactions } from "./TransactionContext"

export const DashboardLoader = ({ children }: any) => {
  const { loading } = useTransactions()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-background">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return children
}