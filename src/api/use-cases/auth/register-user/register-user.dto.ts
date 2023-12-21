import { IsNotEmpty, IsStrongPassword, IsEmail } from 'class-validator';

class PostRegisterUserRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength: 16,
    minLowercase: 6,
    minUppercase: 4,
    minNumbers: 3,
    minSymbols: 3,
  })
  @IsNotEmpty()
  password: string;
}

export { PostRegisterUserRequestDTO };
