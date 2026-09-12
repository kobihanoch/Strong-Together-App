import type {
  AddCommentBody,
  AddCommentParams,
  DeleteCommentParams,
  DeleteReactionParams,
  EditCommentBody,
  EditCommentParams,
  ListCrewPostsParams,
  ReactToPostBody,
  ReactToPostParams,
} from '@strong-together/shared';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { postQueryKeys } from '../query-keys';
import {
  addPostComment,
  deletePostComment,
  deletePostReaction,
  editPostComment,
  getCrewPosts,
  reactToPost,
} from '../services/posts.service';
import { CrewPosts } from '../types/posts.types';

const DEFAULT_PAGE_SIZE = 20;

/**
 * Loads a crew's posts and provides comment and reaction mutations.
 *
 * Posts are fetched with cursor-based pagination after authentication is
 * validated. Fetched pages are flattened for direct list rendering. Successful
 * comment and reaction writes invalidate their post-scoped caches so any active
 * detail queries refresh with the server's latest state.
 *
 * @param crewId - Identifier of the crew whose posts should be loaded.
 * @param limit - Maximum number of posts requested per page. Defaults to 20.
 * @returns Crew posts, pagination/loading state, and post interaction actions.
 */
export const useCrewPosts = (crewId: ListCrewPostsParams['crewId'] | undefined, limit = DEFAULT_PAGE_SIZE) => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = postQueryKeys.crewByUser(crewId, userId, limit);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      if (!crewId) throw new Error('Crew ID is required');
      return getCrewPosts(crewId, { limit, cursor: pageParam });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(isValidatedWithServer && userId && crewId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const invalidateComments = (postId: AddCommentParams['postId']) =>
    queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
  const invalidateReactions = (postId: ReactToPostParams['postId']) =>
    queryClient.invalidateQueries({ queryKey: postQueryKeys.reactions(postId) });

  const addCommentMutation = useMutation({
    mutationFn: ([postId, body]: [AddCommentParams['postId'], AddCommentBody]) => {
      if (!userId) throw new Error('User is not authenticated');
      return addPostComment(postId, body);
    },
    onSuccess: (_, [postId]) => invalidateComments(postId),
  });
  const editCommentMutation = useMutation({
    mutationFn: ([, commentId, body]: [AddCommentParams['postId'], EditCommentParams['id'], EditCommentBody]) =>
      userId ? editPostComment(commentId, body) : Promise.reject(new Error('User is not authenticated')),
    onSuccess: (_, [postId]) => invalidateComments(postId),
  });
  const deleteCommentMutation = useMutation({
    mutationFn: ([, commentId]: [AddCommentParams['postId'], DeleteCommentParams['id']]) =>
      userId ? deletePostComment(commentId) : Promise.reject(new Error('User is not authenticated')),
    onSuccess: (_, [postId]) => invalidateComments(postId),
  });
  const reactMutation = useMutation({
    mutationFn: ([postId, body]: [ReactToPostParams['postId'], ReactToPostBody]) => {
      if (!userId) throw new Error('User is not authenticated');
      return reactToPost(postId, body);
    },
    onSuccess: (_, [postId]) => invalidateReactions(postId),
  });
  const deleteReactionMutation = useMutation({
    mutationFn: (postId: DeleteReactionParams['postId']) => {
      if (!userId) throw new Error('User is not authenticated');
      return deletePostReaction(postId);
    },
    onSuccess: (_, postId) => invalidateReactions(postId),
  });

  const posts: CrewPosts = query.data?.pages.flatMap((page) => page.posts) ?? [];

  return {
    data: { posts },
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isFetchingNextPage: query.isFetchingNextPage,
      isUpdatingComments: addCommentMutation.isPending || editCommentMutation.isPending || deleteCommentMutation.isPending,
      isUpdatingReaction: reactMutation.isPending || deleteReactionMutation.isPending,
    },
    pagination: { hasNextPage: query.hasNextPage },
    actions: {
      fetchNextPage: query.fetchNextPage,
      refetch: query.refetch,
      addComment: (postId: AddCommentParams['postId'], body: AddCommentBody) => addCommentMutation.mutateAsync([postId, body]),
      editComment: (postId: AddCommentParams['postId'], commentId: EditCommentParams['id'], body: EditCommentBody) =>
        editCommentMutation.mutateAsync([postId, commentId, body]),
      deleteComment: (postId: AddCommentParams['postId'], commentId: DeleteCommentParams['id']) =>
        deleteCommentMutation.mutateAsync([postId, commentId]),
      reactToPost: (postId: ReactToPostParams['postId'], body: ReactToPostBody) => reactMutation.mutateAsync([postId, body]),
      deleteReaction: deleteReactionMutation.mutateAsync,
    },
  };
};
