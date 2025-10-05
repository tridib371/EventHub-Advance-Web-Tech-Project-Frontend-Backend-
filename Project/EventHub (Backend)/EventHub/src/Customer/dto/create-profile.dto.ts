import { IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;
}
