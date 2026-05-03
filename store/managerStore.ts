import { create } from "zustand";

type StationState = {
    stationId: string | null;
    stationName:string | null;
    setStationId: (id: string) => void;
    clearStation: () => void;
    setStationName:(name:string)=>void;
};

export const useStationStore = create<StationState>((set) => ({
    stationId: null,
    stationName:null,

    setStationId: (id) => set({ stationId: id }),
    setStationName:(name) => set({ stationName: name }),

    clearStation: () => set({ stationId: null, stationName: null }),
}));