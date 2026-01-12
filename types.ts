
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Prefer not to say'
}

export enum RelationshipStatus {
  SINGLE = 'Single',
  IN_RELATIONSHIP = 'In a Relationship',
  MARRIED = 'Married'
}

export enum PartnerType {
  NONE = 'None',
  BOYFRIEND = 'Boyfriend',
  GIRLFRIEND = 'Girlfriend',
  HUSBAND = 'Husband',
  WIFE = 'Wife'
}

export enum IncomeSource {
  GUARDIAN = 'Guardian Support',
  JOB = 'Job Salary',
  BOTH = 'Both'
}

export enum LifeMode {
  STUDENT = 'Student',
  JOB_HOLDER = 'Job Holder',
  RELATIONSHIP = 'Relationship Focus',
  MARRIED = 'Married Life'
}

export enum LifeEvent {
  NORMAL = 'Normal Month',
  FESTIVAL = 'Festival/Eid Month',
  WEDDING = 'Wedding Season',
  EXAM = 'Exam Month',
  TRANSITION = 'Job Transition'
}

export enum ExpenseType {
  NEED = 'Need',
  WANT = 'Want',
  EMOTIONAL = 'Emotional'
}

export enum PaymentMethod {
  CASH = 'Cash',
  BKASH = 'bKash',
  NAGAD = 'Nagad',
  ROCKET = 'Rocket',
  CARD = 'Bank Card'
}

export enum Mood {
  HAPPY = 'Happy',
  NEUTRAL = 'Neutral',
  STRESSED = 'Stressed'
}

export enum SavingsFlexibility {
  STRICT = 'Strict',
  FLEXIBLE = 'Flexible'
}

export interface UserAccount {
  uid: string;
  email?: string;
  phone?: string;
  isLoggedIn: boolean;
  lastSynced?: string;
}

export interface UserProfile {
  name: string;
  gender: Gender;
  status: RelationshipStatus;
  partnerType: PartnerType;
  incomeSource: IncomeSource;
  lifeMode: LifeMode;
  lifeEvent: LifeEvent;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  subCategory: string;
  type: ExpenseType;
  paymentMethod: PaymentMethod;
  mood: Mood;
  date: string;
  description: string;
}

export interface BorrowLendEntry {
  id: string;
  type: 'borrow' | 'lend';
  amount: number;
  person: string;
  date: string;
  resolved: boolean;
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
}

export interface SavingsGoal {
  amount: number;
  purpose: string;
  flexibility: SavingsFlexibility;
}

export interface MonthData {
  id: string; // YYYY-MM
  monthName: string;
  totalIncome: number;
  incomes: Income[];
  expenses: Expense[];
  borrowLend: BorrowLendEntry[];
  targetBudget: number;
  savingsGoal?: SavingsGoal;
}
