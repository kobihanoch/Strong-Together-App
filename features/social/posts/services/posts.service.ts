import type {
  AddCommentBody,
  AddCommentParams,
  AddCommentResponse,
  CreatePostBody,
  CreatePostResponse,
  DeleteCommentParams,
  DeleteCommentResponse,
  DeletePostParams,
  DeletePostResponse,
  DeleteReactionParams,
  DeleteReactionResponse,
  EditCommentBody,
  EditCommentParams,
  EditCommentResponse,
  ListCrewPostsParams,
  ListCrewPostsQuery,
  ListCrewPostsResponse,
  ListPostCommentsParams,
  ListPostCommentsQuery,
  ListPostCommentsResponse,
  ListPostReactionsParams,
  ListPostReactionsQuery,
  ListPostReactionsResponse,
  ListVisiblePostsQuery,
  ListVisiblePostsResponse,
  ReactToPostBody,
  ReactToPostParams,
  ReactToPostResponse,
  UpdatePostBody,
  UpdatePostParams,
  UpdatePostResponse,
} from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';

export const getVisiblePosts = async (query: ListVisiblePostsQuery): Promise<ListVisiblePostsResponse> => {
  const { data } = await api.get<ListVisiblePostsResponse>('/api/social/posts', { params: query });
  return data;
};

export const getCrewPosts = async (crewId: ListCrewPostsParams['crewId'], query: ListCrewPostsQuery): Promise<ListCrewPostsResponse> => {
  const pathParams = { crewId } satisfies ListCrewPostsParams;
  const { data } = await api.get<ListCrewPostsResponse>(`/api/social/posts/crew/${pathParams.crewId}`, {
    params: query,
  });
  return data;
};

export const createPost = async (body: CreatePostBody): Promise<CreatePostResponse> => {
  const { data } = await api.post<CreatePostResponse>('/api/social/posts', body);
  return data;
};

export const updatePost = async (postId: UpdatePostParams['id'], body: UpdatePostBody): Promise<UpdatePostResponse> => {
  const pathParams = { id: postId } satisfies UpdatePostParams;
  const { data } = await api.patch<UpdatePostResponse>(`/api/social/posts/${pathParams.id}`, body);
  return data;
};

export const deletePost = async (postId: DeletePostParams['id']): Promise<DeletePostResponse> => {
  const pathParams = { id: postId } satisfies DeletePostParams;
  const { data } = await api.delete<DeletePostResponse>(`/api/social/posts/${pathParams.id}`);
  return data;
};

export const getPostComments = async (
  postId: ListPostCommentsParams['postId'],
  query: ListPostCommentsQuery,
): Promise<ListPostCommentsResponse> => {
  const pathParams = { postId } satisfies ListPostCommentsParams;
  const { data } = await api.get<ListPostCommentsResponse>(`/api/social/posts/${pathParams.postId}/comments`, {
    params: query,
  });
  return data;
};

export const addPostComment = async (postId: AddCommentParams['postId'], body: AddCommentBody): Promise<AddCommentResponse> => {
  const pathParams = { postId } satisfies AddCommentParams;
  const { data } = await api.post<AddCommentResponse>(`/api/social/posts/${pathParams.postId}/comments`, body);
  return data;
};

export const editPostComment = async (commentId: EditCommentParams['id'], body: EditCommentBody): Promise<EditCommentResponse> => {
  const pathParams = { id: commentId } satisfies EditCommentParams;
  const { data } = await api.patch<EditCommentResponse>(`/api/social/posts/comments/${pathParams.id}`, body);
  return data;
};

export const deletePostComment = async (commentId: DeleteCommentParams['id']): Promise<DeleteCommentResponse> => {
  const pathParams = { id: commentId } satisfies DeleteCommentParams;
  const { data } = await api.delete<DeleteCommentResponse>(`/api/social/posts/comments/${pathParams.id}`);
  return data;
};

export const getPostReactions = async (
  postId: ListPostReactionsParams['postId'],
  query: ListPostReactionsQuery,
): Promise<ListPostReactionsResponse> => {
  const pathParams = { postId } satisfies ListPostReactionsParams;
  const { data } = await api.get<ListPostReactionsResponse>(`/api/social/posts/${pathParams.postId}/reactions`, {
    params: query,
  });
  return data;
};

export const reactToPost = async (postId: ReactToPostParams['postId'], body: ReactToPostBody): Promise<ReactToPostResponse> => {
  const pathParams = { postId } satisfies ReactToPostParams;
  const { data } = await api.post<ReactToPostResponse>(`/api/social/posts/${pathParams.postId}/reactions`, body);
  return data;
};

export const deletePostReaction = async (postId: DeleteReactionParams['postId']): Promise<DeleteReactionResponse> => {
  const pathParams = { postId } satisfies DeleteReactionParams;
  const { data } = await api.delete<DeleteReactionResponse>(`/api/social/posts/${pathParams.postId}/reactions`);
  return data;
};
