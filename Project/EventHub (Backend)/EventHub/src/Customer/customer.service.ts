import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Customer } from './entities/customer.entity';
import { Profile } from './entities/profile.entity';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoginDto } from './dto/login.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer) private readonly customers: Repository<Customer>,
    @InjectRepository(Profile) private readonly profiles: Repository<Profile>,
  ) {}

  // --------- AUTH ---------
  async register(dto: CreateCustomerDto) {
    const exists = await this.customers.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const entity = this.customers.create({
      email: dto.email,
      name: dto.name,
      password: hashed,
    });
    const saved = await this.customers.save(entity);

    // never return password
    const { password, ...rest } = saved as any;
    return rest;
  }

  async login(dto: LoginDto) {
    // password is select:false on the entity, so we must select it explicitly
    const customer = await this.customers.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'name', 'password'],
    });
    if (!customer) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, customer.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return { id: customer.id, email: customer.email, name: customer.name };
  }

  // --------- CRUD ---------
  findAll() {
    return this.customers.find({ relations: ['profile'] });
  }

  async findOne(id: string) {
    const customer = await this.customers.findOne({ where: { id }, relations: ['profile'] });
    if (!customer) throw new NotFoundException('Not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.customers.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Not found');

    if (dto.email && dto.email !== customer.email) {
      const exists = await this.customers.findOne({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Email in use');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(customer, dto);
    return this.customers.save(customer);
  }

  async remove(id: string) {
    const customer = await this.customers.findOne({ where: { id } });
    if (!customer) throw new NotFoundException('Not found');
    await this.customers.remove(customer);
    return { deleted: true };
  }

  // --------- PROFILE (One-to-One) ---------
  async createProfile(customerId: string, dto: CreateProfileDto) {
    const customer = await this.customers.findOne({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const profile = this.profiles.create({
      address: dto.address,
      phone: dto.phone,
      customer,
    });
    return this.profiles.save(profile);
  }

  async getProfile(customerId: string) {
    const profile = await this.profiles.findOne({
      where: { customer: { id: customerId } },
      relations: ['customer'],
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async deleteProfile(customerId: string) {
    const profile = await this.profiles.findOne({
      where: { customer: { id: customerId } },
    });
    if (!profile) throw new NotFoundException('Profile not found');
    await this.profiles.remove(profile);
    return { deleted: true };
}
}
