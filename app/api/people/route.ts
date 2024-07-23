import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

function createRandomUser() {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  return {
    _id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email,
    firstName,
    lastName,
    sex,
    jobTitle: faker.person.jobTitle(),
  };
}

export async function GET(req, res) {
  return NextResponse.json({ message: "Number of people here" });
}

export async function POST(req, res) {
  const body = await req.json();
  const { num } = body;

  const people = [];

  for (let i = 0; i < num; i++) {
    people.push(createRandomUser());
  }

  return NextResponse.json({ people });
}
