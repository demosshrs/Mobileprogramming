import { Mechanic } from '../types';

const sv = (name: string, priceStr: string, priceNum: number) => ({ name, priceStr, priceNum });

export const mockMechanics: Mechanic[] = [
  {
    id: '1', name: 'Ram Kaji Auto Works', distance: '0.4 km', area: 'Baneshwor',
    rating: 4.9, jobs: 312, tags: ['Bikes', 'Cars', 'EV'], open: true, verified: true,
    price: 'Rs. 300+', experience: '8 yrs', phone: '+977-9841234567',
    about: 'Trusted workshop with 8 years experience. Specialized in bikes, cars, and EVs.',
    services: [
      sv('Oil Change (Bike)', 'Rs. 300–500', 400),
      sv('Full Service (Bike)', 'Rs. 800–1,200', 1000),
      sv('Tyre Puncture', 'Rs. 100–200', 150),
      sv('Battery Check', 'Rs. 150–300', 200),
      sv('Brake Adjustment', 'Rs. 200–400', 300),
    ],
  },
  {
    id: '2', name: 'Shrestha Motors', distance: '1.1 km', area: 'Koteshwor',
    rating: 4.7, jobs: 201, tags: ['Bikes', 'Cars'], open: true, verified: true,
    price: 'Rs. 250+', experience: '5 yrs', phone: '+977-9851234567',
    about: 'Family-run workshop providing quality service at honest prices.',
    services: [
      sv('Oil Change', 'Rs. 250–450', 350),
      sv('Full Service', 'Rs. 700–1,000', 850),
      sv('AC Repair', 'Rs. 500–900', 700),
      sv('Brake Service', 'Rs. 200–350', 275),
    ],
  },
  {
    id: '3', name: 'Nepal EV Care', distance: '2.0 km', area: 'Lazimpat',
    rating: 4.8, jobs: 98, tags: ['EV'], open: false, verified: true,
    price: 'Rs. 500+', experience: '3 yrs', phone: '+977-9861234567',
    about: "Nepal's first dedicated EV service center. Certified for all major EV brands.",
    services: [
      sv('EV Battery Diagnostic', 'Rs. 500–800', 650),
      sv('Charging Port Repair', 'Rs. 300–600', 450),
      sv('Motor Inspection', 'Rs. 400–700', 550),
    ],
  },
];

export const HOME_SERVICES = [
  { icon: '🛢️', label: 'Oil Change' },
  { icon: '🔩', label: 'Full Service' },
  { icon: '🔧', label: 'Puncture' },
  { icon: '🔋', label: 'Battery' },
  { icon: '❄️', label: 'AC Repair' },
  { icon: '🚨', label: 'Emergency' },
];
