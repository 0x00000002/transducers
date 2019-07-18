import R from 'ramda'

const people = [
  {
    username: 'glestrade',
    displayname: 'Inspector Lestrade',
    email: 'glestrade@met.police.uk',
    authHash: 'bdbf9920f42242defd9a7f76451f4f1d',
    lastSeen: '2019-05-13T11:07:22+00:00'
  },
  {
    username: 'mholmes',
    displayname: 'Mycroft Holmes',
    email: 'mholmes@gov.uk',
    authHash: 'b4d04ad5c4c6483cfea030ff4e7c70bc',
    lastSeen: '2019-05-10T11:21:36+00:00'
  },
  {
    username: 'iadler',
    displayname: 'Irene Adler',
    email: null,
    authHash: '319d55944f13760af0a07bf24bd1de28',
    lastSeen: '2019-05-17T11:12:12+00:00'
  }
]

// TODO: Find person with email who was the latest one

// -------- JS --------
let lastPerson = people[0]
for (let i = 0; i < people.length; i++) {
  if (!people[i].email) break
  if (people[i].lastSeen > lastPerson.lastSeen) {
    lastPerson = people[i]
  }
}
console.log(lastPerson)

// -------- ES6 --------
let latest = { lastSeen: '2000-01-01T11:07:22+00:00' }
people
  .filter(person => person.email)
  .map(person => {
    latest = person.lastSeen > latest.lastSeen ? person : latest
  })
console.log(latest)

// -------- ES6 reducer combined with predicate --------
const reducingFn = (lastOne, person) => person.lastSeen > lastOne.lastSeen && person.email !== null ? person : lastOne
const filtered = people.reduce(reducingFn)
console.log(filtered)

// -------- ES6, reducer separated from predicate --------
const withMail = person => person.email !== null
const isLatest = (lastOne, person) => person.lastSeen > lastOne.lastSeen
const latestWithMail = (lastOne, person) => isLatest(lastOne, person) && withMail(person)
const reducer = predicate => (acc, current) => predicate(acc, current) ? current : acc
const reduced = people.reduce(reducer(latestWithMail))
console.log(reduced)

// -------- RamdaJS reducer --------
const hasEmail = R.filter(R.prop('email'))
const lastSeenReducer = (curr, acc) => curr.lastSeen > acc.lastSeen ? curr : acc
const lastSeen = R.reduce(lastSeenReducer, {})
const lastLoggedWithEmail = R.compose(lastSeen, hasEmail)
console.log(lastLoggedWithEmail)

// -------- Ramda transducer -------
const latestPerson = (curr, latest) => curr.lastSeen > latest.lastSeen ? curr : latest
const filters = R.compose(hasEmail)
const transduce = R.transduce(filters, latestPerson, [])
console.log(transduce(people))

