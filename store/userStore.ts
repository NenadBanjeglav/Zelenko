import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
  hasFinishedOnboarding: boolean;
  toggleHasOnboarded: () => void;
};

type UserPersistedState = Pick<UserState, "hasFinishedOnboarding">;

const userInitialState: UserPersistedState = {
  hasFinishedOnboarding: false,
};

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      hasFinishedOnboarding: false,
      toggleHasOnboarded: () => {
        set((state) => {
          return {
            ...state,
            hasFinishedOnboarding: !state.hasFinishedOnboarding,
          };
        });
      },
    }),
    {
      name: "zelenko-user-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return userInitialState as UserState;
        }

        const state = persistedState as Partial<UserPersistedState>;
        return {
          hasFinishedOnboarding: Boolean(state.hasFinishedOnboarding),
        } as UserState;
      },
    },
  ),
);
