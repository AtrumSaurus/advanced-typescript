import {
  addPerson,
  Admin,
  getAllByType,
  getPerson,
  HydratedPersonData,
  PersonData,
  Role,
  updatePerson,
} from "./models/person";

interface PersonDataDTOResponse {
  users: HydratedPersonData[];
  admins: HydratedPersonData[];
}

const seed = async (): Promise<PersonData[]> => {
  // simulate some data being insert in a db...

  const people: PersonData[] = [];

  await addPerson({
    acting: Role.user,
    id: 1,
    name: "test1",
    roleName: Role.user,
  });
  const user = await getPerson(1);

  await addPerson({ ...user, acting: Role.admin, roleName: Role.admin });
  const admin = await getPerson(2);

  await addPerson({
    ...admin,
    roleName: Role.admin,
    acting: Role.user,
    relationship: user,
  });
  const adminUser = await getPerson(3);

  people.push(user, admin, adminUser);

  return people;
};

const fakeGetRestApiEndpoint = async (): Promise<PersonDataDTOResponse> => {
  const people = await seed();

  const hydrated: HydratedPersonData[] = people.map(p => {
    const newP: HydratedPersonData = { ...p, related: null };

    if (p.id === 1 || p.id === 2) {
      newP.roleName = Role.admin;
    }
    if (p.id === 1) {
      newP.acting = Role.admin;
    }
    if (p.id === 3 && people[0]) {
      newP.relationship = people[0];
    }

    newP.related = p.relationship?.id ?? null;

    return newP;
  });

  const users = getAllByType<HydratedPersonData>(hydrated, 'user');
  const admins = getAllByType<Admin>(hydrated, "admin");

  return {
    users,
    admins,
  };
};

const fakePostRestApiEndpoint = async (personId: PersonData['id']): Promise<HydratedPersonData[]> => {
  let people = await seed();

  if (!people.length) {
    return [];
  }

  const parent = people.find(p => p.roleName === Role.admin);

  if (!parent) {
    throw new Error("parent can't be found");
  }

  people = await updatePerson(
    personId,
    { relationship: parent },
    people
  );

  return people.map(p => ({
    ...p,
    related: p.relationship?.id ?? null,
  }));
};

fakeGetRestApiEndpoint().then(p => console.log(p));
fakePostRestApiEndpoint(1).then(p => console.log(p));
fakePostRestApiEndpoint(3).then(p => console.log(p));
