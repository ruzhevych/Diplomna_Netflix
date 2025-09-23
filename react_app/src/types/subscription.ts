export interface SubscriptionDTO {
    id: string;
    userId: number;
    type: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface SubscriptionUpdateDTO {
    type: string;
}

export interface SubscriptionCreateDTO {
    type: string;
}