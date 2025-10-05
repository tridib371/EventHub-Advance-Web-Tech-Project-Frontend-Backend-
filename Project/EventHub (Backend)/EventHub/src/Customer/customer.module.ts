import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from './entities/customer.entity';
import { Profile } from './entities/profile.entity';

import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

import { MailerModule } from '@nestjs-modules/mailer';
import { BeamsService } from '../notifications/beams.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Profile]),
    MailerModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService, BeamsService],
  exports: [CustomerService],
})
export class CustomerModule {}
