export interface User {
  id: number;
  email: string;
  username: string;
  password: string; // Note: This would be hashed on a real backend
  firstName?: string;
  lastName?: string;
  isAuthor: boolean;
  purchasedBooks?: number[]; // IDs of purchased premium books
  createdAt: Date;
  avatar: string; // URL to the user's avatar image
}