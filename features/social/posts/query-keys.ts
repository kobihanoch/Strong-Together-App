export const postQueryKeys = {
  all: ['social', 'posts'] as const,
  crew: (crewId: string | undefined) => [...postQueryKeys.all, 'crew', crewId] as const,
  crewByUser: (crewId: string | undefined, userId: string | null, limit: number) =>
    [...postQueryKeys.crew(crewId), userId, limit] as const,
  comments: (postId: string) => [...postQueryKeys.all, postId, 'comments'] as const,
  reactions: (postId: string) => [...postQueryKeys.all, postId, 'reactions'] as const,
};
