export interface ServiceItem {
  name: string;
  priceStr: string;
  priceNum: number;
}

export interface Mechanic {
  id: string;
  name: string;
  distance: string;
  area: string;
  rating: number;
  jobs: number;
  tags: string[];
  open: boolean;
  verified: boolean;
  price: string;
  experience: string;
  phone: string;
  about: string;
  services: ServiceItem[];
}

export interface Booking {
  id?: string;
  userId: string;
  mechanicId: string;
  mechanicName: string;
  service: string;
  serviceType: 'workshop' | 'home';
  date: string;
  time: string;
  total: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: number;
}

export interface User {
  name: string;
  phone: string;
  email: string;
}
