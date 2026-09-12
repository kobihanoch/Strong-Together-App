import type {
  ListCrewPostsResponse,
  ListPostCommentsResponse,
  ListPostReactionsResponse,
  ListVisiblePostsResponse,
} from '@strong-together/shared';

export type CrewPosts = ListCrewPostsResponse['posts'];
export type CrewPost = CrewPosts[number];
export type VisiblePosts = ListVisiblePostsResponse['posts'];
export type VisiblePost = VisiblePosts[number];
export type PostComments = ListPostCommentsResponse['comments'];
export type PostComment = PostComments[number];
export type PostReactions = ListPostReactionsResponse['reactions'];
export type PostReaction = PostReactions[number];
