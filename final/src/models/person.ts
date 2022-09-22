import { postData, retrieveData } from "../api/api";
import type {User} from "./user";

export enum Role {
  admin = "admin",
  user = "user"
}

export interface PersonData extends Pick<User, "id" | "name"> {
  _id: string;
  acting: Role;
  roleName: Role;
  relationship?: PersonData;
}


export interface PersonDataUpdate extends Partial<PersonData> {
  relationship: PersonData;
}

export const getPerson = async (id: PersonData["id"]): Promise<PersonData> => {

  const userDataString = await retrieveData('users', `${id}`);

  const userData = JSON.parse(userDataString) as User;


  return  {
    ...userData,
    _id: `${id}-uuid`,
    acting: Role.user,
    roleName: Role.user,
  };
};

export const addPerson = async (data: PersonData): Promise<string> => {
  return postData("users", data);
};

export const updatePerson = async (
  id: PersonData["id"],
  data: PersonDataUpdate,
  peopleDb: PersonData[]
): Promise<PersonData[]> => {
  return peopleDb.map(p => (p.id === id ? { ...p, ...data } : p));
};
