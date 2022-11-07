import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  email: string;
  phoneNumber: number | null;
};

export async function deleteUserByUsername(username: string) {
  console.log(username);
  const [user] = await sql<User[]>`
    DELETE FROM
      users
    WHERE
      username = ${username}
    RETURNING
      *
  `;
  return user;
}

export async function updateUserByUsername(
  username: string,
  passwordHash: string,
  name: string,
  email: string,
  phoneNumber: number,
) {
  const [user] = await sql<User[]>`
    UPDATE
      users
    SET
      username = ${username},
      password_hash = ${passwordHash},
      name = ${name},
      email = ${email},
      phone_number = ${phoneNumber}

    WHERE
      username = ${username}
    OR
      users.email = ${email}
    RETURNING *
  `;
  return user;
}

export async function getUserById(id: number) {
  if (!id) return undefined;

  const [user] = await sql<
    {
      id: number;
      username: string;
      name: string;
      email: string;
      phoneNumber: number | null;
    }[]
  >`
  SELECT
    username,
    name,
    email,
    phone_number
  FROM
    users
  WHERE
    users.id = ${id}
  `;

  return user;
}

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<
    {
      username: string;
      name: string;
      email: string;
      phoneNumber: number | null;
    }[]
  >`
  SELECT
    username,
    name,
    email,
    phone_number
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}

export async function getUserByEmail(email: string) {
  if (!email) return undefined;

  const [user] = await sql<
    {
      username: string;
      name: string;
      email: string;
      phoneNumber: number | null;
    }[]
  >`
  SELECT
    username,
    name,
    email,
    phone_number
  FROM
    users
  WHERE
    users.email = ${email}
  `;

  return user;
}

export async function getUserWithPasswordHashByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<User[]>`
  SELECT
    *
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}

export async function getUserBySessionToken(token: string) {
  if (!token) return undefined;

  const [user] = await sql<
    {
      id: number;
      username: string;
      name: string;
      email: string;
      phoneNumber: number | null;
    }[]
  >`
  SELECT
    users.id,
    users.username,
    users.name,
    users.email,
    users.phone_number

  FROM
    users,
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.user_id = users.id AND
    sessions.expiry_timestamp > now();
  `;

  return user;
}

export async function createUser(
  username: string,
  password_hash: string,
  name: string,
  email: string,
  phone_number: number,
) {
  const [userWithoutPassword] = await sql<
    {
      id: number;
      username: string;
      name: string;
      email: string;
      phoneNumber: number | null;
    }[]
  >`
  INSERT INTO users
    (username, password_hash, name, email, phone_number)
  VALUES
    (${username}, ${password_hash}, ${name}, ${email}, ${phone_number})
  RETURNING
    id,
    username,
    name,
    email,
    phone_number
  `;

  return userWithoutPassword!;
}
