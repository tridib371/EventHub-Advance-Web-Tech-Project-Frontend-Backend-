import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { CustomerModule } from './Customer/customer.module';
import { Profile } from './Customer/entities/profile.entity';
import { Customer } from './Customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres', 
      password: '1234', 
      database: 'eventhub_database',
      entities: [Customer, Profile],
      synchronize: true, 
      logging: false,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'sarkartridib886@gmail.com',
          pass: 'qgtg tlat dtfb swlg',
        },
      },
      defaults: {
        from: '"EventHub" <no-reply@eventhub.local>',
      },
    }),
    CustomerModule,
  ],
})
export class AppModule { }
