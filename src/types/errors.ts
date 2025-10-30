export interface queryError {
    message: string;
    code?: string;
  }


  // src/types/errors.ts
export interface ApiError {
    message: string;
    response?: {
      status: number;
      
      data?: {
        message?: string;
      };
    };
  }