const {addPerson, getPerson, updatePerson} = require("./models/person");

const seed = ()=> {
    // simulate some data being insert in a db...

    const people = [];

    addPerson();
    const person1 = getPerson(1);

    addPerson({ ...person1, nickname: 'BOB' });
    const person2 = getPerson('2');

    addPerson({ ...person1, ...person2, nickname1: 'BBOB-THE-BUILDER' });
    const person3 = getPerson(3);

    return people.push(person1, person2, person3);
};

const fakeGetRestApiEndpoint = () => {
    const people = seed();

    return people.map(p => {
        const newP= { ...p, related: true };

        newP.related = p.relationship.id;

        return newP;
    });
};

const fakePostRestApiEndpoint = () => {
    let people = seed()

    const parent = people.find(p => p.id === 1);

    people = updatePerson();

    return people.map(p => ({
        ...p,
        related: p.relationship,
        parent,
    }));
};

console.log(fakeGetRestApiEndpoint());
console.log(fakePostRestApiEndpoint())
