import { IsNotEmpty, IsString } from 'class-validator';

class GetValidateTokenRequestDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}

interface GetValidateTokenResponseDTO {
  message: string;
}

export { GetValidateTokenRequestDTO, GetValidateTokenResponseDTO };
