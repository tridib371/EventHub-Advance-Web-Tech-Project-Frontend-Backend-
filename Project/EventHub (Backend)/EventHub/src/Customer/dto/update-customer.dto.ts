import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
