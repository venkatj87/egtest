import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiSpec(): { api_version: string } {
    return { api_version: 'v1.0'};
  }
}