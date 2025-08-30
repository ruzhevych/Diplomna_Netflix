// src/types/admin.ts
export type Role = "User" | "Admin" | "Moderator";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: Role | string;
  isBlocked: boolean;
}

// Очікуваний формат з беку: new PagedResult(items, totalCount, page, pageSize)
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SendMessageDto {
  userId: number;
  subject: string;
  message: string;
}

export interface SendMessageResponse {
  message: string;
}
