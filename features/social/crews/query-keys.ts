export const crewQueryKeys = {
  all: ['social', 'crews'] as const,
  detail: (crewId: string | undefined) => [...crewQueryKeys.all, 'detail', crewId] as const,
  detailByUser: (crewId: string | undefined, userId: string | null) =>
    [...crewQueryKeys.detail(crewId), userId] as const,
  discoverable: () => [...crewQueryKeys.all, 'discoverable'] as const,
  discoverableByUser: (userId: string | null, limit: number) =>
    [...crewQueryKeys.discoverable(), userId, limit] as const,
  participants: (crewId: string | undefined) => [...crewQueryKeys.all, crewId, 'participants'] as const,
  participantsByUser: (crewId: string | undefined, userId: string | null, limit: number) =>
    [...crewQueryKeys.participants(crewId), userId, limit] as const,
};
