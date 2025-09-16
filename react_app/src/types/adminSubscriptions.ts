export interface AdminSubscriptionDto {
  id: string;                
  userEmail: string;
  type: string;
  startDate: string;         
  endDate: string;
  isActive: boolean;
}

export interface AdminSubscriptionCreateDto {
  userId: number;
  type: string;
  startDate: string;
  endDate: string;
}

export interface AdminSubscriptionUpdateDto {
  type: string;
  endDate?: string;
  isActive?: boolean;
}
