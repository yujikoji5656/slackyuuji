import { Sidebar } from '@/components/Sidebar'
import { MessageList } from '@/components/MessageList'
import { MessageInput } from '@/components/MessageInput'

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <header className="px-5 py-3 border-b flex items-center">
          <h2 className="text-xl font-bold"># general</h2>
        </header>

        <MessageList />
        <MessageInput />
      </main>
    </div>
  )
}

export default App
