import { Injectable, HttpService } from '@nestjs/common';

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

@Injectable()
export class KakaoLogin {
  check: boolean;
  accessToken: string;
  private http: HttpService;
  constructor() {
    this.check = false;
    this.http = new HttpService();
    this.accessToken = '';
  }
  loginCheck(): void {
    this.check = !this.check;
    return;
  }
  async login(url: string, headers: any): Promise<any> {
    return await this.http.post(url, '', { headers }).toPromise();
  }
  setToken(token: string): boolean {
    this.accessToken = token;
    return true;
  }
  async logout(): Promise<any> {
    console.log('들어옴1');
    const _url = 'https://kapi.kakao.com/v1/user/logout';
    const _header = {
      Authorization: `bearer ${this.accessToken}`,
    };
    return await this.http.post(_url, '', { headers: _header }).toPromise();
  }
  async deleteLog(): Promise<any> {
    try {
      console.log('들어옴');
      const _url = 'https://kapi.kakao.com/v1/user/unlink';
      const _header = {
        Authorization: `bearer ${this.accessToken}`,
      };
      return await this.http.post(_url, '', { headers: _header }).toPromise();
    } catch (error) {
      console.error(error);
    }

    //test
  }
}
