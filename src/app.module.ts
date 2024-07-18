import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    ProductModule,
    CategoryModule,
    TagModule,
    ReviewModule,
  ],
})
export class AppModule {}
