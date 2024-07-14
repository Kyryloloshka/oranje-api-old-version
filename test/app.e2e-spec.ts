import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(8000);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:8000');
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@gmail.com',
      password: '135790135790',
    };
    const invalidEmailDto: AuthDto = {
      email: 'test',
      password: '135790135790',
    };
    const invalidPasswordDto: AuthDto = {
      email: 'test@gmail.com',
      password: '12345',
    };
    describe('Sign up', () => {
      it('should throw 400 if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(invalidEmailDto)
          .expectStatus(400);
      });
      it('should throw 400 if password is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: '',
          })
          .expectStatus(400);
      });
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should create a new user and return a JWT token', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should return 403 if user already exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });
    describe('Sign in', () => {
      it('should throw 400 if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(invalidEmailDto)
          .expectStatus(400);
      });
      it('should throw 403 if password is incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(invalidPasswordDto)
          .expectStatus(403);
      });
      it('should throw if no body is provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should return 403 if user does not exist', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'test2@gmail.com',
            password: '135790135790',
          })
          .expectStatus(403);
      });
      it('should return a JWT token', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get user', () => {
      it('should return current user data', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {
      const dto: EditUserDto = {
        email: 'DFsasd@gmail.com',
        lastName: 'Zik',
      };
      it('should edit user data', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.lastName);
      });
    });
  });
});
