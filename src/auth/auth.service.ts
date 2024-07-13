import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      const hashedPassword = await argon.hash(dto.password);
      const user = await this.prismaService.user.findUnique({
        where: {
          email: dto.email,
          hash: hashedPassword,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
    }
  }
  async signin(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }
    const isPasswordValid = await argon.verify(user.hash, dto.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }
    return user;
  }
}
