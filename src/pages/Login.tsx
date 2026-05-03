import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

type Mode = 'login' | 'signup'

export function Login() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/', { replace: true })
    }
  }, [authLoading, session, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return
    if (password.length < 6) {
      toast.error('パスワードは6文字以上で入力してください')
      return
    }
    setLoading(true)
    const { error } =
      mode === 'signup'
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(mode === 'signup' ? 'サインアップしました' : 'ログインしました')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Slackyuuji</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">ログイン</TabsTrigger>
              <TabsTrigger value="signup">サインアップ</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">パスワード（6文字以上）</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <TabsContent value="login" className="m-0">
                <Button type="submit" className="w-full" disabled={loading}>
                  ログイン
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="m-0">
                <Button type="submit" className="w-full" disabled={loading}>
                  サインアップ
                </Button>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
