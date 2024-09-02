import { ApiProperty } from '@nestjs/swagger';

export class JwtToken {
  access_token: string;
  consent_required: boolean;
}
