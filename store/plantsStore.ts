import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PlantType = {
  id: string;
  name: string;
  wateringFrequencyDays: number;
  lastWateredAtTimestamp?: number;
  imageUri?: string;
};

type PlantsState = {
  nextId: number;
  plants: PlantType[];
  addPlant: (
    name: string,
    wateringFrequencyDays: number,
    imageUri?: string,
  ) => void;
  removePlant: (plantId: string) => void;
  waterPlant: (plantId: string) => void;
  updatePlant: (
    plantId: string,
    updates: {
      name?: string;
      wateringFrequencyDays?: number;
      imageUri?: string | null;
    },
  ) => void;
};

type PlantsPersistedState = Pick<PlantsState, "nextId" | "plants">;

const plantsInitialState: PlantsPersistedState = {
  nextId: 1,
  plants: [],
};

export const usePlantStore = create(
  persist<PlantsState>(
    (set) => ({
      plants: [],
      nextId: 1,
      addPlant: (
        name: string,
        wateringFrequencyDays: number,
        imageUri?: string,
      ) => {
        return set((state) => {
          return {
            ...state,
            nextId: state.nextId + 1,
            plants: [
              {
                id: String(state.nextId),
                name,
                wateringFrequencyDays,
                imageUri,
              },
              ...state.plants,
            ],
          };
        });
      },
      removePlant: (plantId: string) => {
        return set((state) => {
          return {
            ...state,
            plants: state.plants.filter((plant) => plant.id !== plantId),
          };
        });
      },
      waterPlant: (plantId: string) => {
        return set((state) => {
          return {
            ...state,
            plants: state.plants.map((plant) => {
              if (plant.id === plantId) {
                return {
                  ...plant,
                  lastWateredAtTimestamp: Date.now(),
                };
              }
              return plant;
            }),
          };
        });
      },
      updatePlant: (plantId, updates) => {
        return set((state) => {
          return {
            ...state,
            plants: state.plants.map((plant) => {
              if (plant.id !== plantId) {
                return plant;
              }

              return {
                ...plant,
                name: updates.name ?? plant.name,
                wateringFrequencyDays:
                  updates.wateringFrequencyDays ?? plant.wateringFrequencyDays,
                imageUri:
                  updates.imageUri === null
                    ? undefined
                    : (updates.imageUri ?? plant.imageUri),
              };
            }),
          };
        });
      },
    }),
    {
      name: "zelenko-plants-store",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return plantsInitialState as PlantsState;
        }

        const state = persistedState as Partial<PlantsPersistedState>;
        const plants = Array.isArray(state.plants) ? state.plants : [];
        const nextId =
          typeof state.nextId === "number" && state.nextId > 0
            ? state.nextId
            : plants.reduce((maxId, plant) => {
                const idNumber = Number(plant.id);
                if (!Number.isFinite(idNumber)) {
                  return maxId;
                }
                return Math.max(maxId, idNumber);
              }, 0) + 1;

        return {
          plants,
          nextId,
        } as PlantsState;
      },
    },
  ),
);
