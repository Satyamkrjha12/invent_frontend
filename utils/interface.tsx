import {
  Building2,
  CreditCard,
  Warehouse,
  MapPin,
  Package,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface OnboardingStep {
  id: number;
  title: string;
  icon: LucideIcon;
}

export const steps: OnboardingStep[] = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Subscription", icon: CreditCard },
  { id: 3, title: "Sites", icon: Warehouse },
  { id: 4, title: "Locations", icon: MapPin },
  { id: 5, title: "Categories", icon: Package },
  { id: 6, title: "Asset Fields", icon: ClipboardList },
  { id: 7, title: "Events", icon: CalendarDays },
];