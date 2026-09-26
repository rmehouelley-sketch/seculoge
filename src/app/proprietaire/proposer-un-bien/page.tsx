'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, MapPin, DollarSign, Camera, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/ToastProvider';
import { PROPERTY_TYPES, COTONOU_DISTRICTS, BENIN_CITIES } from '@/lib/utils';

const cityOptions = BENIN_CITIES.map((city) => ({ value: city, label: city }));
const districtOptions = COTONOU_DISTRICTS.map((district) => ({ value: district, label: district }));
const typeOptions = Object.entries(PROPERTY_TYPES).map(([value, label]) => ({ value, label }));

const equipmentOptions = [
  { value: 'hasWater', label: 'Eau' },
  { value: 'hasWaterMeter', label: 'Compteur d\'eau' },
  { value: 'hasElectricity', label: 'Électricité' },
  { value: 'hasElectricMeter', label: 'Compteur électrique' },
  { value: 'hasInternet', label: 'Internet' },
  { value: 'hasFurniture', label: 'Meublé' },
  { value: 'hasAirConditioning', label: 'Climatisation' },
  { value: 'hasParking', label: 'Parking' },
  { value: 'hasGarden', label: 'Jardin' },
  { value: 'hasSecurity', label: 'Sécurité' },
];

export default function ProposePropertyPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic info
    title: '',
    description: '',
    type: '',
    
    // Location
    city: '',
    district: '',
    address: '',
    
    // Details
    roomCount: '',
    bedroomCount: '',
    bathroomCount: '',
    area: '',
    floor: '',
    
    // Pricing
    monthlyRent: '',
    securityDeposit: '',
    
    // Equipment
    hasWater: false,
    hasWaterMeter: false,
    hasElectricity: false,
    hasElectricMeter: false,
    hasInternet: false,
    hasFurniture: false,
    hasAirConditioning: false,
    hasParking: false,
    hasGarden: false,
    hasSecurity: false,
    
    // Images
    images: [] as File[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      // Limit to 10 images
      const selectedFiles = files.slice(0, 10);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...selectedFiles] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title) newErrors.title = 'Titre requis';
      if (!formData.type) newErrors.type = 'Type de logement requis';
      if (!formData.city) newErrors.city = 'Ville requise';
      if (!formData.district) newErrors.district = 'Quartier requis';
      if (!formData.address) newErrors.address = 'Adresse requise';
    } else if (step === 2) {
      if (!formData.roomCount) newErrors.roomCount = 'Nombre de pièces requis';
      if (!formData.bedroomCount) newErrors.bedroomCount = 'Nombre de chambres requis';
      if (!formData.monthlyRent) newErrors.monthlyRent = 'Loyer mensuel requis';
    } else if (step === 3) {
      if (formData.images.length === 0) {
        newErrors.images = 'Au moins une photo est requise';
      }
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
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && value !== '') {
          formDataToSend.append(key, String(value));
        }
      });

      // Append images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      const response = await fetch('/api/proprietaire/properties', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission');
      }

      addToast({
        type: 'success',
        title: 'Bien reçu',
        message: 'Votre bien a bien été transmis à SécuLoge. Notre équipe vous contactera pour organiser la vérification.',
      });

      router.push('/proprietaire/mes-biens');
      router.refresh();
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card variant="elevated" className="shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">SL</span>
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">
              Proposer mon bien
            </h1>
            <p className="text-secondary-500">
              Complétez le formulaire pour soumettre votre logement
            </p>

            {/* Progress Steps */}
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4].map((s) => (
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
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <>
                  <Input
                    label="Titre du logement"
                    name="title"
                    placeholder="Ex: Bel appartement 3 pièces à Cotonou"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    leftIcon={<Home className="h-5 w-5" />}
                    fullWidth
                  />

                  <Textarea
                    label="Description"
                    name="description"
                    placeholder="Décrivez votre logement (état, particularités, environnement, etc.)"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    rows={4}
                  />

                  <Select
                    label="Type de logement"
                    name="type"
                    options={typeOptions}
                    placeholder="Sélectionnez le type"
                    value={formData.type}
                    onChange={handleChange}
                    error={errors.type}
                    fullWidth
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Select
                      label="Ville"
                      name="city"
                      options={cityOptions}
                      placeholder="Sélectionnez la ville"
                      value={formData.city}
                      onChange={handleChange}
                      error={errors.city}
                      fullWidth
                    />
                    <Select
                      label="Quartier"
                      name="district"
                      options={districtOptions}
                      placeholder="Sélectionnez le quartier"
                      value={formData.district}
                      onChange={handleChange}
                      error={errors.district}
                      fullWidth
                    />
                  </div>

                  <Input
                    label="Adresse complète"
                    name="address"
                    placeholder="Ex: Rue 123, Quartier X, Cotonou"
                    value={formData.address}
                    onChange={handleChange}
                    error={errors.address}
                    leftIcon={<MapPin className="h-5 w-5" />}
                    fullWidth
                  />

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => router.push('/proprietaire')}>
                      Annuler
                    </Button>
                    <Button onClick={handleNext}>
                      Suivant
                    </Button>
                  </div>
                </>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Nombre de pièces"
                      name="roomCount"
                      type="number"
                      min={1}
                      placeholder="Ex: 3"
                      value={formData.roomCount}
                      onChange={handleChange}
                      error={errors.roomCount}
                      fullWidth
                    />
                    <Input
                      label="Nombre de chambres"
                      name="bedroomCount"
                      type="number"
                      min={1}
                      placeholder="Ex: 2"
                      value={formData.bedroomCount}
                      onChange={handleChange}
                      error={errors.bedroomCount}
                      fullWidth
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Nombre de salles de bain"
                      name="bathroomCount"
                      type="number"
                      min={1}
                      placeholder="Ex: 1"
                      value={formData.bathroomCount}
                      onChange={handleChange}
                      fullWidth
                    />
                    <Input
                      label="Surface (m²)"
                      name="area"
                      type="number"
                      placeholder="Ex: 80"
                      value={formData.area}
                      onChange={handleChange}
                      fullWidth
                    />
                  </div>

                  <Input
                    label="Étage"
                    name="floor"
                    type="number"
                    placeholder="Ex: 1 (Rez-de-chaussée = 0)"
                    value={formData.floor}
                    onChange={handleChange}
                    fullWidth
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Loyer mensuel (FCFA)"
                      name="monthlyRent"
                      type="number"
                      min={10000}
                      placeholder="Ex: 100000"
                      value={formData.monthlyRent}
                      onChange={handleChange}
                      error={errors.monthlyRent}
                      leftIcon={<DollarSign className="h-5 w-5" />}
                      fullWidth
                    />
                    <Input
                      label="Caution (FCFA)"
                      name="securityDeposit"
                      type="number"
                      placeholder="Ex: 200000"
                      value={formData.securityDeposit}
                      onChange={handleChange}
                      leftIcon={<DollarSign className="h-5 w-5" />}
                      fullWidth
                    />
                  </div>

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

              {/* Step 3: Equipment */}
              {step === 3 && (
                <>
                  <h3 className="font-semibold text-secondary-900 mb-4">
                    Équipements disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {equipmentOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 p-3 bg-secondary-50 rounded-lg cursor-pointer hover:bg-secondary-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          name={option.value}
                          checked={formData[option.value as keyof typeof formData] as boolean || false}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-secondary-700">{option.label}</span>
                      </label>
                    ))}
                  </div>

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

              {/* Step 4: Images */}
              {step === 4 && (
                <>
                  <h3 className="font-semibold text-secondary-900 mb-4">
                    Photos du logement
                  </h3>
                  <p className="text-secondary-500 mb-4">
                    Ajoutez des photos de qualité pour mettre en valeur votre logement (max 10 photos)
                  </p>

                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-secondary-300 rounded-xl p-6 mb-6 text-center cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Camera className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <p className="text-secondary-600 mb-2">
                      Glissez-déposez vos photos ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-sm text-secondary-500">
                      Format: JPG, PNG | Taille max: 5MB par image
                    </p>
                  </div>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative rounded-xl overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          >
                            <X className="h-4 w-4 text-secondary-600" />
                          </button>
                          <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <p className="text-danger-600 text-sm mb-4">{errors.images}</p>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="h-5 w-5" /> Retour
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      leftIcon={<Check className="h-5 w-5" />}
                    >
                      {isLoading ? 'Soumission en cours...' : 'Soumettre mon bien'}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {/* Summary */}
            {step > 1 && step < 5 && (
              <Card variant="bordered" className="mt-8 bg-secondary-50">
                <CardHeader>
                  <h3 className="font-semibold text-secondary-900">
                    Récapitulatif
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Titre</span>
                      <span className="font-medium">{formData.title || 'Non spécifié'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Type</span>
                      <span className="font-medium">
                        {formData.type ? PROPERTY_TYPES[formData.type as keyof typeof PROPERTY_TYPES] : 'Non spécifié'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Localisation</span>
                      <span className="font-medium">
                        {formData.district}, {formData.city}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Loyer</span>
                      <span className="font-medium">
                        {formData.monthlyRent ? `${parseInt(formData.monthlyRent).toLocaleString('fr-FR')} FCFA` : 'Non spécifié'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-500">Pièces / Chambres</span>
                      <span className="font-medium">
                        {formData.roomCount} p. / {formData.bedroomCount} ch.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
