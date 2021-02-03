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

@Injectable()
export class MyService {
  data: string;

  getData(): string {
    return this.data;
  }

  setData(data: string): void {
    this.data = data;
    return;
  }
}
