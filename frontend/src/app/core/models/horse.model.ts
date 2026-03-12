export interface Horse {
  id: number;
  name: string;
  passport_number?: string;
  passport_expiry?: string;
  date_of_birth?: string;
  nationality?: string;
  breed?: HorseBreed;
  breed_type?: BreedType;
  colour?: HorseColour;
  sire?: string;
  dam?: string;
  sire_of_dam?: string;
  gender?: 'stallion' | 'mare' | 'gelding';
  microchip_number?: string;
  qr_link?: string;
  fei_link?: string;
  is_test: boolean;
  created_at: string;
  updated_at: string;
}

export interface HorseBreed {
  id: number;
  name: string;
  code?: string;
  is_active: boolean;
}

export interface HorseColour {
  id: number;
  name: string;
  code?: string;
  is_active: boolean;
}

export interface BreedType {
  id: number;
  name: string;
  is_active: boolean;
}

export interface StudFarm {
  id: number;
  name: string;
  location?: string;
  is_active: boolean;
}

