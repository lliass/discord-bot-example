import { IsNotEmpty, IsString, IsArray, IsDateString } from 'class-validator';

class PostRegisterMonitorRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  nickname: string;

  @IsArray()
  @IsNotEmpty()
  roles: string[];

  @IsDateString()
  @IsNotEmpty()
  contractDate?: string;
}

export { PostRegisterMonitorRequestDTO };
