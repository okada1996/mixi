'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// ✅ default export ではないため、.then で明示的に指定
const Calendar = dynamic(() => import('@/components/ui/calendar').then(mod => mod.Calendar), {
  ssr: false,
})

export default function GroupChatPage() {
  const [message, setMessage] = useState('')

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">グループチャット</h1>

      {/* ✅ SSR無効で読み込んだカレンダー */}
      <div className="border rounded-md p-4">
        <Calendar />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="メッセージを入力"
        />
        <button
          onClick={() => {
            if (message) {
              alert(`送信: ${message}`)
              setMessage('')
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          送信
        </button>
      </div>
    </div>
  )
}