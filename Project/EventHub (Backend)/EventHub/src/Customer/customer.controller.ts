import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { LoginDto } from './dto/login.dto';
import { CreateProfileDto } from './dto/create-profile.dto';

import { SessionAuthGuard } from './guards/session-auth.guard';
import { TrimStringPipe } from './pipes/trim-string.pipe';

import { MailerService } from '@nestjs-modules/mailer';
import { BeamsService } from '../notifications/beams.service';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly service: CustomerService,
    private readonly mailerService: MailerService,
    private readonly beams: BeamsService,
  ) {}

  // --------- AUTH ---------

  // Customer registration
  @Post('register')
  @UsePipes(new TrimStringPipe(), new ValidationPipe())
  async register(@Body() dto: CreateCustomerDto) {
    const created = await this.service.register(dto);
    await this.beams.publish('Customer registered', `Name: ${created.name}`);
    return created;
  }

  // Customer login
  @Post('login')
  @UsePipes(new TrimStringPipe(), new ValidationPipe())
  async login(@Body() dto: LoginDto, @Req() req: any) {
    const user = await this.service.login(dto);
    req.session.user = user;
    return { message: 'Login successful', user };
  }

  // Customer logout
  @Post('logout')
  @UseGuards(SessionAuthGuard)
  logout(@Req() req: any) {
    const user = req.session.user;
    if (!user) {
      throw new HttpException('Not logged in', 401);
    }
    req.session.destroy(() => {});
    return { message: 'Logged out' };
  }

  // Get currently logged-in user
  @Get('me')
  @UseGuards(SessionAuthGuard)
  me(@Req() req: any) {
    const user = req.session.user;
    if (!user) {
      throw new HttpException('Not logged in', 401);
    }
    return user;
  }

  // --------- CUSTOMER CRUD ---------

  @Get()
  @UseGuards(SessionAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SessionAuthGuard)
  @UsePipes(new TrimStringPipe(), new ValidationPipe({ whitelist: true }))
  async patch(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCustomerDto) {
    const updated = await this.service.update(id, dto);
    await this.beams.publish('Customer updated (PATCH)', `Name: ${updated.name}`);
    return updated;
  }

  @Put(':id')
  @UseGuards(SessionAuthGuard)
  @UsePipes(new TrimStringPipe(), new ValidationPipe({ whitelist: true }))
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCustomerDto) {
    const updated = await this.service.update(id, dto);
    await this.beams.publish('Customer updated (PUT)', `Name: ${updated.name}`);
    return updated;
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const res = await this.service.remove(id);
    await this.beams.publish('Customer deleted', `ID: ${id}`);
    return res;
  }

  // --------- PROFILE ---------

  @Post(':id/profile')
  @UseGuards(SessionAuthGuard)
  @UsePipes(new TrimStringPipe(), new ValidationPipe({ whitelist: true }))
  async createProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateProfileDto,
  ) {
    const profile = await this.service.createProfile(id, dto);
    await this.beams.publish('Profile created', `Customer: ${id}`);
    return profile;
  }

  @Get(':id/profile')
  @UseGuards(SessionAuthGuard)
  getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getProfile(id);
  }

  @Delete(':id/profile')
  @UseGuards(SessionAuthGuard)
  async deleteProfile(@Param('id', ParseUUIDPipe) id: string) {
    const r = await this.service.deleteProfile(id);
    await this.beams.publish('Profile deleted', `Customer: ${id}`);
    return r;
  }

  // --------- EMAIL (simple demo) ---------

  @Post('send-email')
  async sendEmail(@Body() body: { email: string; subject: string; text: string }) {
    await this.mailerService.sendMail({
      to: body.email,
      subject: body.subject,
      text: body.text,
    });
    return { message: 'Email sent successfully' };
}
}
