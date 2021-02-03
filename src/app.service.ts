import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getStaticPathWithService = (): string => 'data : getStaticPathWithService';
  getDynamicPathWithservice(data: string): string {
    return `data : getDynamicPathWithservice(${data})`;
  }
}
