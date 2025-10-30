export const BaseClientUrl = 
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' 
    : process.env.NEXT_PUBLIC_APP_URL;
    
export const BaseApiUrl = 
    process.env.NODE_ENV === 'development' ? 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_URL;

// export const BaseApiUrl = process.env.NEXT_PUBLIC_API_URL;
export const NODE_ENV = process.env.NODE_ENV;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const ClientSession = process.env.NEXT_PUBLIC_CLIENT_SESSION;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
