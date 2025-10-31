export interface User {
  id: number;
  name: string;
  email: string;
  phoneNo: string | null;
  role: string;
  is_active: boolean;
  user_type: string;
}

export interface Lab {
  id: string;
  name: string;
  franchiseId: number;
  address: string;
  googlePlaceId: string;
  workingHours: string;
  reviews: number;
  rating: number;
  latitude: number;
  longitude: number;
  pincode: number;
  locality: string;
  city: string;
  state: string;
  country: string;
  website: string;
  franchiseWebsite: string;
  phoneNo: number;
  directionsUri: string;
  placeUri: string;
  photosUri: string[];
  status: string;
  localityCityId: number;
  registrationNo: string | null;
  email: string | null;
  createdDate: string;
  lastModifiedDate: string;
}

export interface Test {
  id: number;
  name: string;
  approvalStatus: string;
  city: City[];
  fastingTime: number;
  inclusion_names: string[];
  cost: number;
  parameter: Parameter[];
}

export interface Package {
  id: number;
  name: string;
  cost: number;
  approvalStatus: string;
  isFastingRequired: boolean;
  fastingTime: number;
  inclusion_names: string[];
  providerCity: string[];
  instructions: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
}

export interface Parameter {
  id: string;
  label: string;
}

export interface Booking {
  id: number;
  testName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  labName: string;
  cost: number;
}

export interface Subscription {
  id: number;
  plan: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  amount: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface ApiError {
  message: string;
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
}
