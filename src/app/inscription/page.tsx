'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/ToastProvider';
import { UserRole } from '@prisma/client';

const roleOptions = [
  { value: 'TENANT', label: 'Locataire - Je cherche un logement' },
  { value: 'OWNER', label: 'Propriétaire - Je propose mon bien' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'TENANT' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Prénom requis';
      if (!formData.lastName) newErrors.lastName = 'Nom requis';
      if (!formData.email) {
        newErrors.email = 'Email requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      if (!formData.phone) {
        newErrors.phone = 'Téléphone requis';
      }
    } else if (step === 2) {
      if (!formData.password) newErrors.password = 'Mot de passe requis';
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmez le mot de passe';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
      if (!formData.role) newErrors.role = 'Rôle requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Auto sign in after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      addToast({
        type: 'success',
        title: 'Inscription réussie',
        message: 'Bienvenue sur SécuLoge',
      });

      // Redirect based on role
      if (formData.role === 'TENANT') {
        router.push('/locataire');
      } else {
        router.push('/proprietaire');
      }
      router.refresh();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erreur d\'inscription',
        message: error.message || 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12">
      <div className="max-w-2xl w-full px-4">
        <Card variant="elevated" className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">SL</span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Créer un compte
            </h1>
            <p className="text-secondary-500">
              Rejoignez SécuLoge en quelques étapes
            </p>

            {/* Progress Steps */}
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    s === step
                      ? 'bg-primary-600'
                      : s < step
                      ? 'bg-success-500'
                      : 'bg-secondary-300'
                  }`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Prénom"
                      name="firstName"
                      placeholder="Votre prénom"
                      value={formData.firstName}
                      onChange={handleChange}
                      error={errors.firstName}
                      leftIcon={<User className="h-5 w-5" />}
                      fullWidth
                    />
                    <Input
                      label="Nom"
                      name="lastName"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={handleChange}
                      error={errors.lastName}
                      leftIcon={<User className="h-5 w-5" />}
                      fullWidth
                    />
                  </div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    leftIcon={<Mail className="h-5 w-5" />}
                    fullWidth
                  />
                  <Input
                    label="Téléphone"
                    name="phone"
                    type="tel"
                    placeholder="+229 12 34 56 78"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    leftIcon={<Phone className="h-5 w-5" />}
                    fullWidth
                  />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => router.push('/')}>
                      Annuler
                    </Button>
                    <Button onClick={handleNext}>
                      Suivant
                    </Button>
                  </div>
                </>
              )}

              {/* Step 2: Account Info */}
              {step === 2 && (
                <>
                  <Select
                    label="Je suis"
                    name="role"
                    options={roleOptions}
                    placeholder="Sélectionnez votre rôle"
                    value={formData.role}
                    onChange={handleChange}
                    error={errors.role}
                    fullWidth
                  />
                  <Input
                    label="Mot de passe"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Créez un mot de passe"
                    value={formData.password}
                    onChange={handleChange}
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
                  <Input
                    label="Confirmer le mot de passe"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    leftIcon={<Lock className="h-5 w-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-secondary-400 hover:text-secondary-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    }
                    fullWidth
                  />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="h-5 w-5" /> Retour
                    </Button>
                    <Button onClick={handleNext}>
                      Suivant
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <>
                  <div className="bg-secondary-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-secondary-900 mb-4">
                      Récapitulatif
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Nom complet</span>
                        <span className="font-medium">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Email</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Téléphone</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary-500">Rôle</span>
                        <span className="font-medium">
                          {formData.role === 'TENANT' ? 'Locataire' : 'Propriétaire'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="h-5 w-5" /> Retour
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                    >
                      {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                    </Button>
                  </div>
                </>
              )}
            </form>

            <p className="text-center text-secondary-500 mt-6">
              Vous avez déjà un compte ?{' '}
              <Link
                href="/connexion"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Se connecter
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
