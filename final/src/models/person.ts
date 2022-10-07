import { postData, retrieveData } from "../api/api";
import type {User} from "./user";

export enum Role {
  admin = "admin",
  user = "user"
}

export interface PersonData extends Pick<User, "id"| "name"> {
  acting: Role;
  roleName: Role;
  relationship?: PersonData;
}

export interface Admin extends PersonData {
  acting: Role.admin;
  roleName: Role.admin;
}

type PersonType = 'admin' | 'user'
export function getAllByType<Res>(people: PersonData[], type: PersonType ): Res[] {

  let result: Res[] = []

  if (!type) {
    result = people.filter(p => p.roleName !== Role.admin) as Res[]
  }

  if (type === 'admin') {
    result = people.filter(p => p.roleName === Role.admin) as Res[]
  }

  return result
}

export const getPerson = async (id: PersonData["id"]): Promise<PersonData> => {

  const userDataString = await retrieveData('users', `${id}`);

  const userData = JSON.parse(userDataString) as User;

  return  {
    ...userData,
    acting: Role.user,
    roleName: Role.user,
  };
};

export const addPerson = async (data: PersonData): Promise<string> => {
  return postData("users", data);
};


export interface PersonDataUpdate extends Partial<PersonData> {
  relationship: PersonData;
}
export const updatePerson = async (
  id: PersonData['id'],
  data: PersonDataUpdate,
  peopleDb: PersonData[]
): Promise<PersonData[]> => {
  return peopleDb.map(p => (p.id === id ? { ...p, ...data } : p));
};
