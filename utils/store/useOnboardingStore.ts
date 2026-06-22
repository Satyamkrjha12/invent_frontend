import { create } from "zustand";

export interface CompanyInfoData {
  companyName: string;
  industry: string;
  orgSize: string;
  email: string;
  phone: string;
  address: string;
}

export interface SubscriptionData {
  plan: string;
  billing: "monthly" | "yearly";
}

export interface SiteData {
  id: string;
  name: string;
  type: string;
  address: string;
}

export interface LocationData {
  id: string;
  siteId: string;
  name: string;
  description: string;
}

export interface OnboardingState {
  currentStep: number;
  isCompleted: boolean;
  companyInfo: CompanyInfoData;
  subscription: SubscriptionData;
  sites: SiteData[];
  locations: LocationData[];
  categories: string[];
  assetFields: string[];
  events: string[];
  
  setStep: (step: number) => void;
  nextStep: () => void;
  backStep: () => void;
  completeOnboarding: () => void;
  updateCompanyInfo: (info: Partial<CompanyInfoData>) => void;
  updateSubscription: (sub: Partial<SubscriptionData>) => void;
  setSites: (sites: SiteData[]) => void;
  setLocations: (locations: LocationData[]) => void;
  setCategories: (categories: string[]) => void;
  setAssetFields: (fields: string[]) => void;
  setEvents: (events: string[]) => void;
  resetStore: () => void;
}

const initialFormData = {
  companyInfo: {
    companyName: "",
    industry: "",
    orgSize: "1-10",
    email: "",
    phone: "",
    address: "",
  },
  subscription: {
    plan: "professional",
    billing: "monthly" as const,
  },
  sites: [
    { id: "1", name: "Primary Warehouse", type: "warehouse", address: "HQ Site" },
  ],
  locations: [
    { id: "1", siteId: "1", name: "Aisle A, Bin 1", description: "General Storage" },
  ],
  categories: ["Electronics & Devices", "Office Supplies", "Tools & Equipment"],
  assetFields: ["serial_number", "barcode", "purchase_price"],
  events: ["check_in", "check_out", "transfer", "audit"],
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  isCompleted: false,
  ...initialFormData,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
  backStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  completeOnboarding: () => set({ isCompleted: true }),
  
  updateCompanyInfo: (info) =>
    set((state) => ({
      companyInfo: { ...state.companyInfo, ...info },
    })),
    
  updateSubscription: (sub) =>
    set((state) => ({
      subscription: { ...state.subscription, ...sub },
    })),
    
  setSites: (sites) => set({ sites }),
  setLocations: (locations) => set({ locations }),
  setCategories: (categories) => set({ categories }),
  setAssetFields: (assetFields) => set({ assetFields }),
  setEvents: (events) => set({ events }),
  resetStore: () => set({ currentStep: 1, isCompleted: false, ...initialFormData }),
}));
