"use client"

import { Sidebar } from "@/modules/shared/components/Sidebar"
import { Header } from "@/modules/shared/components/Header"

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full min-h-full">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-3xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
