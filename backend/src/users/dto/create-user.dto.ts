import {
  IsString,
  Length,
  IsUrl,
  IsEmail,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @ValidateIf((_o, value) => value !== '')
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;
}
