import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function MessageInput() {
  return (
    <div className="sticky bottom-0 border-t p-4 flex gap-2 bg-background">
      <Input
        placeholder="# general にメッセージを送信"
        className="flex-1"
      />
      <Button>送信</Button>
    </div>
  )
}
