import {
  IsArray,
  IsString,
  IsEmail,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';

export class SendEmailDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  to: string[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
