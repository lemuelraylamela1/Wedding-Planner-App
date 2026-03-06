// Wedding data types and initial state
export interface WeddingDetails {
  brideName: string;
  groomName: string;
  date: string;
  location: string;
  theme: string;
  guestCount: number;
  budget: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: "pending" | "accepted" | "declined" | "maybe";
  mealPreference: string;
  plusOne: boolean;
  dietaryRestrictions: string;
  tableAssignment?: string;
}

export interface TimelineTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  status: "inquiry" | "quoted" | "booked" | "paid";
  cost: number;
  notes: string;
}

// Initial sample data
export const initialWeddingDetails: WeddingDetails = {
  brideName: "Sarah",
  groomName: "Michael",
  date: "2024-06-15",
  location: "Riverside Manor",
  theme: "Romantic Garden",
  guestCount: 150,
  budget: 50000,
};

export const initialGuests: Guest[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "555-0101",
    rsvpStatus: "accepted",
    mealPreference: "Chicken",
    plusOne: false,
    dietaryRestrictions: "None",
    tableAssignment: "Table 1",
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma@example.com",
    phone: "555-0102",
    rsvpStatus: "pending",
    mealPreference: "Vegetarian",
    plusOne: true,
    dietaryRestrictions: "Vegetarian",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "555-0103",
    rsvpStatus: "accepted",
    mealPreference: "Beef",
    plusOne: false,
    dietaryRestrictions: "None",
    tableAssignment: "Table 2",
  },
];

export const initialTimeline: TimelineTask[] = [
  {
    id: "1",
    title: "Book Venue",
    description: "Finalize venue reservation and sign contract",
    dueDate: "2024-01-30",
    status: "completed",
    priority: "high",
    category: "Venue",
  },
  {
    id: "2",
    title: "Send Save the Dates",
    description: "Send initial announcement to guests",
    dueDate: "2024-02-28",
    status: "in-progress",
    priority: "high",
    category: "Invitations",
  },
  {
    id: "3",
    title: "Book Photographer",
    description: "Confirm photographer for wedding day",
    dueDate: "2024-02-15",
    status: "pending",
    priority: "medium",
    category: "Vendors",
  },
];

export const initialBudget: Budget[] = [
  { id: "1", category: "Venue", budgeted: 8000, spent: 8000 },
  { id: "2", category: "Catering", budgeted: 15000, spent: 12000 },
  { id: "3", category: "Photography", budgeted: 3000, spent: 0 },
  { id: "4", category: "Flowers", budgeted: 2500, spent: 1200 },
  { id: "5", category: "Decorations", budgeted: 3000, spent: 1500 },
  { id: "6", category: "Music/DJ", budgeted: 2000, spent: 2000 },
  { id: "7", category: "Invitations", budgeted: 600, spent: 400 },
  { id: "8", category: "Other", budgeted: 16000, spent: 5000 },
];

export const initialVendors: Vendor[] = [
  {
    id: "1",
    name: "Elite Catering Co.",
    category: "Catering",
    contact: "Chef Maria Rodriguez",
    email: "maria@elitecatering.com",
    phone: "555-0201",
    status: "booked",
    cost: 15000,
    notes: "Menu finalized. Tasting scheduled for March 10.",
  },
  {
    id: "2",
    name: "Bloom & Blossom Florals",
    category: "Flowers",
    contact: "Lisa Chen",
    email: "lisa@bloomblossom.com",
    phone: "555-0202",
    status: "quoted",
    cost: 2500,
    notes: "Awaiting final design approval.",
  },
  {
    id: "3",
    name: "Riverside Photography",
    category: "Photography",
    contact: "James Wilson",
    email: "james@riversidephoto.com",
    phone: "555-0203",
    status: "inquiry",
    cost: 3000,
    notes: "Portfolio sent. Waiting for response.",
  },
];
