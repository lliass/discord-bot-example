import { IsNotEmpty, IsEmail } from 'class-validator';

class LoginRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  accessKey: string;
}

interface LoginResponseDTO {
  token: string;
}

export { LoginRequestDTO, LoginResponseDTO };
