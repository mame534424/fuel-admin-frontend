import { create } from "zustand";

type StationState = {
    stationId: string | null;
    setStationId: (id: string) => void;
    clearStation: () => void;
};

export const useStationStore = create<StationState>((set) => ({
    stationId: null,

    setStationId: (id) => set({ stationId: id }),

    clearStation: () => set({ stationId: null }),
}));