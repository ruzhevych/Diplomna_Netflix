import axios from "axios";
import type { Comment, CommentCreateDto } from "../types/comment";

const API_URL = "http://localhost:5170/api/comment"; 

export async function getComments(movieId: number): Promise<Comment[]> {
  const res = await axios.get(`${API_URL}/movie/${movieId}`, { withCredentials: true });
  return res.data;
}

export async function addComment(dto: CommentCreateDto): Promise<Comment> {
  const res = await axios.post(`${API_URL}/add`, dto, { withCredentials: true });
  return res.data;
}

export async function updateComment(commentId: string, newContent: string): Promise<Comment> {
  const res = await axios.put(`${API_URL}/update/${commentId}`, newContent, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return res.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await axios.delete(`${API_URL}/delete/${commentId}`, { withCredentials: true });
}
