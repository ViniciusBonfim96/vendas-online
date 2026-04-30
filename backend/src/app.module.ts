import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateModule } from '@/state/state.module';
import { CityModule } from '@/city/city.module';
import { AddressModule } from '@/address/address.module';
import { CacheModule } from '@/cache/cache.module';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@/guards/rooles.guard';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CartProductModule } from './cart-product/cart-product.module';
import { PaymentStatusModule } from './payment-status/payment-status.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { OrderProductModule } from './order-product/order-product.module';
import { CorreiosModule } from './correios/correios.module';
import { MelhorEnvioModule } from './melhor-envio/melhor-envio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env.development.local'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migration/*{.ts,.js}'],
      migrationsRun: true,
    }),
    UserModule,
    StateModule,
    CityModule,
    AddressModule,
    CacheModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    CartModule,
    CartProductModule,
    PaymentStatusModule,
    PaymentModule,
    OrderModule,
    OrderProductModule,
    CorreiosModule,
    MelhorEnvioModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
