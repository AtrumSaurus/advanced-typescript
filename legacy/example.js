const {addPerson, getPerson, updatePerson} = require("./models/person");

const seed = ()=> {
    // simulate some data being insert in a db...

    const people = [];

    addPerson();
    const person1 = getPerson(1);

    addPerson({ ...person1, sex: 'male' });
    const person2 = getPerson('male');

    addPerson({ ...person1, ...person2, sex1: 'female' });
    const person3 = getPerson(3);

    people.push(person1, person2, person3);

    return people;
};

const fakeGetRestApiEndpoint = () => {
    const people = seed();

    return people.map(p => {
        const newP= { ...p, related: true };

        newP.related = p.relationship?._id ?? null;

        return newP;
    });
};

const fakePostRestApiEndpoint = () => {
    let people = seed()

    const parent = people.find(p => p.id === 1);

    people = updatePerson();

    return people.map(p => ({
        ...p,
        related: p.relationship?._id ?? null,
        parent,
    }));
};

console.log(fakeGetRestApiEndpoint());
console.log(fakePostRestApiEndpoint())
