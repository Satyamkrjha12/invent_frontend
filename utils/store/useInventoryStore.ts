import { create } from "zustand";

export interface Item {
  sku: string;
  name: string;
  category: string;
  qty: number;
  site: string;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface InventoryState {
  items: Item[];
  addItem: (item: Item) => void;
  updateItem: (sku: string, updatedFields: Partial<Item>) => void;
  deleteItem: (sku: string) => void;
}

const INITIAL_ITEMS: Item[] = [
  {
    sku: "LP-PRO-16",
    name: "Pro Laptop 16-inch",
    category: "Electronics & Devices",
    qty: 24,
    site: "Primary Warehouse",
    price: 1299,
    status: "In Stock",
  },
  {
    sku: "MO-HD-27",
    name: "Ultra HD Monitor 27-inch",
    category: "Electronics & Devices",
    qty: 15,
    site: "Primary Warehouse",
    price: 349,
    status: "In Stock",
  },
  {
    sku: "OF-CH-01",
    name: "Ergonomic Desk Chair",
    category: "Furniture & Fittings",
    qty: 4,
    site: "HQ Storefront",
    price: 189,
    status: "Low Stock",
  },
  {
    sku: "TL-DR-12",
    name: "Cordless Drill Set 12V",
    category: "Tools & Equipment",
    qty: 0,
    site: "HQ Storefront",
    price: 89,
    status: "Out of Stock",
  },
  {
    sku: "PK-BX-M",
    name: "Medium Cardboard Boxes",
    category: "Packaging Materials",
    qty: 450,
    site: "Primary Warehouse",
    price: 1.5,
    status: "In Stock",
  },
  {
    sku: "SF-GL-05",
    name: "Anti-fog Safety Goggles",
    category: "Safety Gear",
    qty: 2,
    site: "Primary Warehouse",
    price: 12,
    status: "Low Stock",
  },
];

const getStatus = (qty: number): "In Stock" | "Low Stock" | "Out of Stock" => {
  if (qty === 0) return "Out of Stock";
  if (qty <= 5) return "Low Stock";
  return "In Stock";
};

export const useInventoryStore = create<InventoryState>((set) => ({
  items: INITIAL_ITEMS,

  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          status: getStatus(item.qty),
        },
      ],
    })),

  updateItem: (sku, updatedFields) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.sku === sku) {
          const merged = { ...item, ...updatedFields };
          if (updatedFields.qty !== undefined) {
            merged.status = getStatus(updatedFields.qty);
          }
          return merged;
        }
        return item;
      }),
    })),

  deleteItem: (sku) =>
    set((state) => ({
      items: state.items.filter((item) => item.sku !== sku),
    })),
}));
