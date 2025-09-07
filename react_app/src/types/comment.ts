export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userName: string;
  userProfilePictureUrl?: string;
}

export interface CommentCreateDto {
  content: string;
  movieId: number;
}
