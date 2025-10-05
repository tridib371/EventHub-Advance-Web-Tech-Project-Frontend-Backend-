import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToOne(() => Customer, (customer) => customer.profile, { onDelete: 'CASCADE' })
  customer: Customer;
}
