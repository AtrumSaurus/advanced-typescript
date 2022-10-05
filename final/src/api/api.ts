import fetch, { RequestInit } from "node-fetch";
import type { PersonData } from "../models/person";

interface Opts extends RequestInit {
  remapStatus?: boolean;
  scope?: string;
}

type Resources = 'posts' | 'comments' |  'albums' |  'photos' |  'users'


const buildFullUrl = (res: Resources, id?: string) => `https://jsonplaceholder.typicode.com/${res}/${id}`

export const retrieveData = async (
  resource: Resources,
  id?: string,
  options: Opts = {}
): Promise<string> => {
  const response = await fetch(buildFullUrl(resource, id), options);

  if (!response.ok) {
    return "err";
  }

  return response.text();
};

export async function postData(
  res: Resources,
  data: PersonData,
  id?: string,
  options: Opts = {}
): Promise<string> {
  const response = await fetch(buildFullUrl(res, id), {
    ...options,
    method: 'post',
    body: JSON.stringify({
      payload: data,
      scope: options.scope,
    }),
  });

  if (!response.ok) {
    return "err";
  }

  return response.text();
}
