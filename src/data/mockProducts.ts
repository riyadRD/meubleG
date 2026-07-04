import { Product, ProductCategory } from '@/types';

export const mockProducts: Product[] = [
  {
    id: 'p-1',
    title: 'Salon Royal Velvet',
    description: 'Un salon luxueux en velours premium, conçu pour offrir un confort absolu et une élégance intemporelle à votre espace de vie.',
    features: [
      'Velours anti-taches haute densité',
      'Structure en bois massif garanti 10 ans',
      'Assises en mousse HR 35kg/m³',
      'Coussins déhoussables et lavables'
    ],
    price: 185000,
    category: 'salons',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop',
    ],
    isNew: true,
    isPopular: true,
    inStock: true,
  },
  {
    id: 'p-2',
    title: 'Suite Élite Moderne',
    description: 'Chambre à coucher complète avec un design épuré, alliant fonctionnalité et esthétique minimaliste.',
    features: [
      'Lit King Size (180x200cm)',
      'Deux tables de nuit avec tiroirs soft-close',
      'Armoire 4 portes avec miroir intégré',
      'Finition bois naturel et laque mate'
    ],
    price: 240000,
    category: 'chambres',
    images: [
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop',
    ],
    isNew: false,
    isPopular: true,
    inStock: true,
  },
  {
    id: 'p-3',
    title: 'Table Céramique Luxe',
    description: 'Table à manger extensible avec plateau en céramique marbrée et piétement en métal design.',
    features: [
      'Plateau en céramique anti-rayures (12mm)',
      'Extensible de 160cm à 220cm',
      'Capacité: 6 à 10 personnes',
      'Piétement acier finition époxy noir'
    ],
    price: 95000,
    category: 'tables',
    images: [
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop',
    ],
    isNew: true,
    isPopular: false,
    inStock: true,
  },
  {
    id: 'p-4',
    title: 'Canapé d\'Angle Oslo',
    description: 'Design scandinave épuré pour ce canapé d\'angle modulable, parfait pour les intérieurs contemporains.',
    features: [
      'Tissu bouclette tendance',
      'Méridienne réversible',
      'Pieds en chêne massif',
      'Confort mi-ferme'
    ],
    price: 145000,
    category: 'salons',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop',
    ],
    isNew: false,
    isPopular: true,
    inStock: false,
  },
  {
    id: 'p-5',
    title: 'Meuble TV Horizon',
    description: 'Meuble TV suspendu avec éclairage LED intégré et grand espace de rangement.',
    features: [
      'Longueur 200cm',
      '3 abattants avec système push-to-open',
      'Passage de câbles intégré',
      'LED avec télécommande'
    ],
    price: 45000,
    category: 'meubles',
    images: [
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800&auto=format&fit=crop',
    ],
    isNew: true,
    isPopular: false,
    inStock: true,
  },
  {
    id: 'p-6',
    title: 'Table Basse Iris',
    description: 'Ensemble de deux tables basses gigognes, alliant verre trempé et laiton brossé.',
    features: [
      'Verre trempé fumé 8mm',
      'Structure acier finition laiton',
      'Design gain de place',
      'Facile d\'entretien'
    ],
    price: 28000,
    category: 'tables',
    images: [
      'https://images.unsplash.com/photo-1532372576444-dda954194ad0?q=80&w=800&auto=format&fit=crop',
    ],
    isNew: false,
    isPopular: true,
    inStock: true,
  }
];
