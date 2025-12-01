import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Connexion réussie')
        navigate('/dashboard')
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) throw error
        toast.success('Compte créé avec succès')
        setIsLogin(true)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isLogin 
            ? 'Entrez vos identifiants pour vous connecter' 
            : 'Créez un compte pour commencer'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              placeholder="Jean Dupont"
              required
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="m@example.com"
            required
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <a href="#" className="ml-auto inline-block text-sm underline">
              Mot de passe oublié ?
            </a>
          </div>
          <Input
            id="password"
            required
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
        </Button>
      </form>
    </div>
  )
}
