import { User as PrismaUser } from '@prisma/client';
import { hashSync } from 'bcrypt';

export interface UserProps {
  id?: string;
  email: string;
  name?: string | null;
  password: string;
  sessionId?: string | null;
}

export interface UserToApi {
  id: string;
  email: string;
  name?: string;
}

export class User {
  id: string;
  email: string;
  name?: string | null;
  password: string;
  sessionId?: string | null;

  constructor(props: UserProps) {
    this.id = props.id ?? '';
    this.email = props.email;
    this.name = props.name ?? null;
    this.password = props.password;
    this.sessionId = props.sessionId ?? null;
  }

  public hashPassword(): void {
    this.password = hashSync(this.password, 10);
  }

  static PrismaToEntity(prismaUser: PrismaUser | null): User | null {
    if (!prismaUser) {
      return null;
    }

    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      password: prismaUser.password,
      sessionId: prismaUser.sessionId,
    });
  }

  static EntityToApi(user: User | null): UserToApi | null {
    if (!user) {
      return null;
    }

    return {
      id: user.id ?? '',
      email: user.email ?? undefined,
      name: user.name ?? undefined,
    };
  }
}
