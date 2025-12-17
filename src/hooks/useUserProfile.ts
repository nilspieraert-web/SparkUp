import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/firestore";
import { UserProfile } from "../types/auth";

export const useUserProfile = (uid: string | undefined) => {
  return useQuery<UserProfile | null>({
    queryKey: ["user-profile", uid],
    enabled: Boolean(uid),
    queryFn: () => fetchUserProfile(uid ?? ""),
    staleTime: 5 * 60 * 1000,
  });
};
