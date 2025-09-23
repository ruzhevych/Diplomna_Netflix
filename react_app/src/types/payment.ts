export interface CardDTO {
  id: number;
  token: string;
  cardNumber: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  isDefault: boolean;
  cvv: string,
}

export interface CardCreateDTO {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvv: string,
  cardholderName: string;
  makeDefault: boolean;
}

export interface CardUpdateDTO {
  cardNumber?: string;
  cardholderName?: string;
  expMonth?: number;
  expYear?: number;
  cvv: string,
}
