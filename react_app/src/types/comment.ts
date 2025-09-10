export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userName: string;
  userProfilePictureUrl: string;
  contentType: string;
}

export interface CommentCreateDto {
  content: string;
  movieId: number;
  movieType: string;
}

export interface RatingDto {
  contentId: number;
  contentType: string;
  stars: number;
}
