import {
  addPerson,
  getPerson,
  PersonData,
  Role,
  updatePerson,
} from "./models/person";

interface PersonDataDTOResponse extends PersonData {
  related: string | null;
}

const seed = async (): Promise<PersonData[]> => {
  // simulate some data being insert in a db...

  const people: PersonData[] = [];

  await addPerson({
    acting: Role.user,
    id: 1,
    _id: "1-uuid",
    name: "test1",
    roleName: Role.user,
  });
  const person1 = await getPerson(1);

  await addPerson({ ...person1, acting: Role.admin });
  const person2 = await getPerson(2);

  await addPerson({
    ...person1,
    ...person2,
    roleName: Role.admin,
    relationship: person2,
  });
  const person3 = await getPerson(3);

  people.push(person1, person2, person3);

  return people;
};

const fakeGetRestApiEndpoint = async (): Promise<PersonDataDTOResponse[]> => {
  const people = await seed();

  if (!people || !people.length) {
    throw new Error("can't seed");
  }

  return people.map(p => {
    const newP: PersonDataDTOResponse = { ...p, related: null };

    if (p.id === 1 || p.id === 2) {
      newP.roleName = Role.admin;
    }
    if (p.id === 1) {
      newP.acting = Role.admin;
    }
    if (p.id === 3 && people[0]) {
      newP.relationship = people[0];
    }

    newP.related = p.relationship?._id ?? null;

    return newP;
  });
};

const fakePostRestApiEndpoint = async (): Promise<PersonDataDTOResponse[]> => {
  let people = await seed();

  if (!people.length) {
    return [];
  }

  const parent = people.find(p => p.id === 1);

  if (!parent) {
    throw new Error("parent can't be found");
  }

  people = await updatePerson(
    people?.[0]?.id || -1,
    { relationship: parent },
    people
  );

  return people.map(p => ({
    ...p,
    related: p.relationship?._id ?? null,
  }));
};

fakeGetRestApiEndpoint().then(p => console.log(p));
fakePostRestApiEndpoint().then(p => console.log(p));
