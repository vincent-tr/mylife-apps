export interface Criteria {
  minDate: Date;
  maxDate: Date | null;
  account: string | null;
  group: string | null;
  lookupText: string | null;
}