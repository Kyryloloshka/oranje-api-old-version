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
  describe('Product', () => {
    describe('Get empty product list', () => {
      it('should return an empty array', () => {
        return pactum.spec().get('/products').expectStatus(200).expectBody([]);
      });
    });
    const createProductDto = {
      title: 'product',
      price: 123,
      thumbnail: 'image/url',
    };
    describe('Create product', () => {
      it('should create a product', () => {
        return pactum
          .spec()
          .post('/products')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(201)
          .withBody(createProductDto)
          .stores('productId', 'id');
      });
      it('should throw 400 if invalid data is provided', () => {
        return pactum
          .spec()
          .post('/products')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(400)
          .withBody({
            title: 'product',
            price: '',
            thumbnail: 456,
          });
      });
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });

    describe('Get product by id', () => {
      it('should get a product by id', () => {
        return pactum
          .spec()
          .get('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .expectStatus(200)
          .expectBodyContains(createProductDto.title)
          .expectBodyContains(createProductDto.price)
          .expectBodyContains(createProductDto.thumbnail)
          .expectBodyContains('$S{productId}');
      });
      it('should throw 404 if product is not found', () => {
        return pactum
          .spec()
          .get('/products/{id}')
          .withPathParams('id', 134543)
          .expectStatus(404);
      });
    });

    describe('Get all products', () => {
      it('should get all products', () => {
        return pactum
          .spec()
          .get('/products')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Edit product', () => {
      const editProductDto = {
        title: 'edited product',
        price: 456,
        description: 'description',
        stock: 45,
        brand: 'apple',
        weight: 34,
        dimensions: '34x34x34',
        color: 'red',
        material: 'plastic',
        tags: ['tag1', 'tag2'],
        thumbnail: 'image/url2',
        images: ['image/url3', 'image/url4'],
      };
      it('should edit a product', () => {
        return pactum
          .spec()
          .patch('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withBody(editProductDto)
          .expectStatus(200)
          .expectBodyContains(editProductDto.title)
          .expectBodyContains(editProductDto.price)
          .expectBodyContains(editProductDto.description)
          .expectBodyContains(editProductDto.stock)
          .expectBodyContains(editProductDto.brand)
          .expectBodyContains(editProductDto.weight)
          .expectBodyContains(editProductDto.dimensions)
          .expectBodyContains(editProductDto.color)
          .expectBodyContains(editProductDto.material)
          .expectBodyContains(editProductDto.tags)
          .expectBodyContains(editProductDto.thumbnail)
          .expectBodyContains(editProductDto.images);
      });
      it('should throw 400 if invalid data is provided', () => {
        return pactum
          .spec()
          .patch('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(400)
          .withBody({
            title: 'edited product',
            price: '',
            thumbnail: 456,
          });
      });
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it('should throw 401 if the user is not authenticated or the token is invalid', () => {
        return pactum
          .spec()
          .patch('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .withBody(editProductDto)
          .expectStatus(401);
      });
    });

    describe('Delete product', () => {
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it('should throw 401 if the user is not authenticated or the token is invalid', () => {
        return pactum
          .spec()
          .delete('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .expectStatus(401);
      });
      it('should delete a product', () => {
        return pactum
          .spec()
          .delete('/products/{id}')
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .withPathParams('id', '$S{productId}')
          .expectStatus(204);
      });
      it('should get empty product list', () => {
        return pactum.spec().get('/products').expectStatus(200).expectBody([]);
      });
    });

    describe('Search products', () => {
      it.todo('should search for products');
      it.todo('should return an empty array if no products are found');
    });

    describe('Filter products', () => {
      it.todo('should filter products by category');
      it.todo('should filter products by price range');
      it.todo('should filter products by tags');
    });

    describe('Sort products', () => {
      it.todo('should sort products by price');
      it.todo('should sort products by rating');
      it.todo('should sort products by popularity');
    });
  });

  describe('Category', () => {
    describe('Create category', () => {
      it.todo('should create a category');
      it.todo('should throw 400 if invalid data is provided');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Edit category', () => {
      it.todo('should edit a category');
      it.todo('should throw 400 if invalid data is provided');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Delete category', () => {
      it.todo('should delete a category');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Get category', () => {
      it.todo('should get a category');
      it.todo('should throw 404 if category is not found');
    });
  });

  describe('Tag', () => {
    describe('Create tag', () => {
      it.todo('should create a tag');
      it.todo('should throw 400 if invalid data is provided');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Edit tag', () => {
      it.todo('should edit a tag');
      it.todo('should throw 400 if invalid data is provided');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Delete tag', () => {
      it.todo('should delete a tag');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Get tag', () => {
      it.todo('should get a tag');
      it.todo('should throw 404 if tag is not found');
    });
  });

  describe('Cart', () => {
    describe('Add to cart', () => {
      it.todo('should add a product to the cart');
      it.todo('should throw 400 if product ID is invalid');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Remove from cart', () => {
      it.todo('should remove a product from the cart');
      it.todo('should throw 400 if product ID is invalid');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Get cart contents', () => {
      it.todo('should get the cart contents');
      it.todo('should return an empty array if the cart is empty');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Create order', () => {
      it.todo('should create an order');
      it.todo('should throw 400 if cart is empty');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Order history', () => {
      it.todo('should get order history');
      it.todo('should return an empty array if no orders are found');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });
  });

  describe('Payment', () => {
    describe('Integrate payment gateways', () => {
      it.todo('should integrate with payment gateways');
    });

    describe('Process payment', () => {
      it.todo('should process payments');
      it.todo('should throw 400 if payment details are invalid');
    });

    describe('Confirm order', () => {
      it.todo('should confirm an order after successful payment');
      it.todo('should throw 400 if payment confirmation is invalid');
    });
  });

  describe('Shipping', () => {
    describe('Integrate shipping services', () => {
      it.todo('should integrate with shipping services');
    });

    describe('Calculate shipping costs', () => {
      it.todo('should calculate shipping costs');
      it.todo('should throw 400 if shipping details are invalid');
    });

    describe('Track shipping status', () => {
      it.todo('should track shipping status');
      it.todo('should throw 400 if tracking number is invalid');
    });
  });

  describe('Admin User Management', () => {
    describe('View user list', () => {
      it.todo('should view the user list');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });

    describe('Block/unblock user', () => {
      it.todo('should block a user');
      it.todo('should unblock a user');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });

    describe('Set user roles', () => {
      it.todo('should set user roles');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });
  });

  describe('Content Management', () => {
    describe('Manage banners and advertisements', () => {
      it.todo('should manage banners and advertisements');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });

    describe('Manage static pages', () => {
      it.todo('should manage static pages');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });
  });

  describe('Reviews and Ratings', () => {
    describe('Add a review', () => {
      it.todo('should add a review');
      it.todo('should throw 400 if review data is invalid');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Edit a review', () => {
      it.todo('should edit a review');
      it.todo('should throw 400 if review data is invalid');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Delete a review', () => {
      it.todo('should delete a review');
      it.todo('should throw 400 if review ID is invalid');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Rate a product', () => {
      it.todo('should rate a product');
      it.todo('should throw 400 if rating data is invalid');
      it.todo(
        'should throw 403 if the user is not authenticated or the token is invalid',
      );
    });

    describe('Moderate reviews', () => {
      it.todo('should moderate reviews');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });
  });

  describe('Analytics and Reporting', () => {
    describe('Display key metrics', () => {
      it.todo('should display key metrics on the admin dashboard');
    });

    describe('Generate sales reports', () => {
      it.todo('should generate sales reports');
    });

    describe('Display product view statistics', () => {
      it.todo('should display product view statistics');
    });
  });

  describe('Customer Support', () => {
    describe('Handle support tickets', () => {
      it.todo('should handle support tickets');
    });

    describe('Support live chat', () => {
      it.todo('should support live chat');
    });
  });

  describe('Marketing', () => {
    describe('Manage promo codes and discounts', () => {
      it.todo('should manage promo codes and discounts');
      it.todo('should throw 400 if promo code data is invalid');
      it.todo(
        'should throw 403 if user is not an admin or does not have the required permissions',
      );
    });

    describe('Handle email newsletters', () => {
      it.todo('should handle email newsletters');
    });

    describe('Integrate with social media', () => {
      it.todo('should integrate with social media');
    });
  });
});
