"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/utils/api";

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

interface OnboardingContextProps {
  currentStep: number;
  isCompleted: boolean;
  companyInfo: CompanyInfoData;
  subscription: SubscriptionData;
  sites: SiteData[];
  locations: LocationData[];
  categories: string[];
  assetFields: string[];
  events: string[];
  
  // Auth state
  token: string | null;
  user: { id: string; name: string; email: string; role: string; tenantId: string | null; tenantName: string | null } | null;
  isLoading: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;

  setStep: (step: number) => void;
  nextStep: () => void;
  backStep: () => void;
  completeOnboarding: () => Promise<void>;
  updateCompanyInfo: (info: Partial<CompanyInfoData>) => void;
  updateSubscription: (sub: Partial<SubscriptionData>) => void;
  setSites: (sites: SiteData[]) => void;
  setLocations: (locations: LocationData[]) => void;
  setCategories: (categories: string[]) => void;
  setAssetFields: (fields: string[]) => void;
  setEvents: (events: string[]) => void;
  resetStore: () => void;
}

const initialCompanyInfo: CompanyInfoData = {
  companyName: "",
  industry: "",
  orgSize: "1-10",
  email: "",
  phone: "",
  address: "",
};

const initialSubscription: SubscriptionData = {
  plan: "professional",
  billing: "monthly",
};

const initialSites: SiteData[] = [
  { id: "1", name: "Primary Warehouse", type: "warehouse", address: "HQ Site" },
];

const initialLocations: LocationData[] = [
  { id: "1", siteId: "1", name: "Aisle A, Bin 1", description: "General Storage" },
];

const initialCategories = ["Electronics & Devices", "Office Supplies", "Tools & Equipment"];
const initialAssetFields = ["serial_number", "barcode", "purchase_price"];
const initialEvents = ["check_in", "check_out", "transfer", "audit"];

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoData>(initialCompanyInfo);
  const [subscription, setSubscription] = useState<SubscriptionData>(initialSubscription);
  const [sites, setSitesState] = useState<SiteData[]>(initialSites);
  const [locations, setLocationsState] = useState<LocationData[]>(initialLocations);
  const [categories, setCategoriesState] = useState<string[]>(initialCategories);
  const [assetFields, setAssetFieldsState] = useState<string[]>(initialAssetFields);
  const [events, setEventsState] = useState<string[]>(initialEvents);

  // Auth State
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (newToken: string, newUser: any) => {
    localStorage.setItem("token", newToken);
    document.cookie = `auth-token=${newToken}; path=/; max-age=86400; SameSite=Lax`;
    setToken(newToken);
    setUser(newUser);
    if (newUser?.tenantName) {
      setCompanyInfo((prev) => ({ ...prev, companyName: newUser.tenantName }));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
    setToken(null);
    setUser(null);
    setIsCompleted(false);
    resetStore();
  };

  useEffect(() => {
    async function checkSession() {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (storedToken) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/verify`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            setToken(storedToken);
            setUser(data.user);
            if (data.user?.tenantId) {
              setIsCompleted(true);
              if (data.user.tenantName) {
                setCompanyInfo((prev) => ({ ...prev, companyName: data.user.tenantName }));
              }
            }
          } else {
            localStorage.removeItem("token");
            document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
          }
        } catch (e) {
          console.error("Session verification failed:", e);
        }
      }
      setIsLoading(false);
    }
    checkSession();
  }, []);

  const setStep = (step: number) => setCurrentStep(step);
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 7));
  const backStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const completeOnboarding = async () => {
    try {
      const payload = {
        companyInfo: {
          companyName: companyInfo.companyName,
          currency: "USD",
          timezone: "UTC",
          industry: companyInfo.industry,
          orgSize: companyInfo.orgSize,
          phone: companyInfo.phone,
          address: companyInfo.address,
        },
        sites: sites.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          address: s.address,
        })),
        locations: locations.map((l) => ({
          id: l.id,
          siteId: l.siteId,
          name: l.name,
          description: l.description,
        })),
        categories: categories,
        unitsOfMeasure: [
          { name: "Pieces", abbreviation: "pcs" },
          { name: "Kilograms", abbreviation: "kg" },
          { name: "Boxes", abbreviation: "box" }
        ],
        items: [],
      };

      const response = await api.post("/onboarding", payload);
      if (response && response.token) {
        login(response.token, {
          ...user,
          tenantId: response.tenant.id,
          tenantName: response.tenant.name,
        });
        setIsCompleted(true);
      }
    } catch (err: any) {
      console.error("Onboarding failed:", err);
      alert(err.message || "Failed to complete onboarding");
      throw err;
    }
  };

  const updateCompanyInfo = (info: Partial<CompanyInfoData>) => {
    setCompanyInfo((prev) => ({ ...prev, ...info }));
  };

  const updateSubscription = (sub: Partial<SubscriptionData>) => {
    setSubscription((prev) => ({ ...prev, ...sub }));
  };

  const setSites = (newSites: SiteData[]) => setSitesState(newSites);
  const setLocations = (newLocations: LocationData[]) => setLocationsState(newLocations);
  const setCategories = (newCategories: string[]) => setCategoriesState(newCategories);
  const setAssetFields = (newFields: string[]) => setAssetFieldsState(newFields);
  const setEvents = (newEvents: string[]) => setEventsState(newEvents);

  const resetStore = () => {
    setCurrentStep(1);
    setIsCompleted(false);
    setCompanyInfo(initialCompanyInfo);
    setSubscription(initialSubscription);
    setSitesState(initialSites);
    setLocationsState(initialLocations);
    setCategoriesState(initialCategories);
    setAssetFieldsState(initialAssetFields);
    setEventsState(initialEvents);
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        isCompleted,
        companyInfo,
        subscription,
        sites,
        locations,
        categories,
        assetFields,
        events,
        
        token,
        user,
        isLoading,
        login,
        logout,

        setStep,
        nextStep,
        backStep,
        completeOnboarding,
        updateCompanyInfo,
        updateSubscription,
        setSites,
        setLocations,
        setCategories,
        setAssetFields,
        setEvents,
        resetStore,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
