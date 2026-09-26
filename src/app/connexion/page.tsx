'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email requis' }));
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Mot de passe requis' }));
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        addToast({
          type: 'error',
          title: 'Erreur de connexion',
          message: 'Email ou mot de passe incorrect',
        });
      } else {
        addToast({
          type: 'success',
          title: 'Connexion réussie',
          message: 'Bienvenue sur SécuLoge',
        });
        router.push('/logements');
        router.refresh();
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12">
      <div className="max-w-md w-full px-4">
        <Card variant="elevated" className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">SL</span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Connexion
            </h1>
            <p className="text-secondary-500">
              Connectez-vous à votre compte SécuLoge
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="h-5 w-5" />}
                fullWidth
              />

              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                fullWidth
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-secondary-600">Se souvenir de moi</span>
                </label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-500 mb-4">
                Ou connectez-vous avec
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  className="max-w-xs"
                >
                  Google
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  className="max-w-xs"
                >
                  Facebook
                </Button>
              </div>
            </div>

            <p className="text-center text-secondary-500 mt-6">
              Vous n'avez pas de compte ?{' '}
              <Link
                href="/inscription"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                S'inscrire
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
