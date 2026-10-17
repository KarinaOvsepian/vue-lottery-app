export interface Participant {
  id: string;
  name: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

export type ParticipantFormData = Omit<Participant, 'id'>;

export type FormErrors = Partial<Record<keyof ParticipantFormData, string>>;

export type SortField = 'name' | 'dateOfBirth' | null;
export type SortOrder = 'asc' | 'desc';
