export interface UserProfileType {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    is_active?: boolean;
    date_of_birth?:string;
    role?: string;
    created_at?: string;
    updated_at?: string;
  }


export interface UpdateProfilePayload {
  name: string;
  phone: string;
  date_of_birth?: string;
  // updated_at: string;
}

