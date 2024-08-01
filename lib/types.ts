import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface AppUser extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

export interface DoctorpediaUser {
  id: string;
  first_name: string;
  last_name: string;
  place_of_work: string;
  title: { name: string };
  area_practice: { name: string };
  email: string;
  avatar: string;
}

export interface DoctorpediaPatient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  number: number;
  gender: string;
  date_birthday: string | null;
}