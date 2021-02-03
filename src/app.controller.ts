import { Controller, Get, Param, Header, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // StaticPath
  @Get('/b')
  getStaticPath(): string {
    return `data : StaticPath`;
  }

  // StaticPathWithService
  @Get('/b2')
  getStaticPathWithService(): string {
    return this.appService.getStaticPathWithService();
  }
  // DynamicPath
  @Get('/b/:data')
  getDynamicPath(@Param('data') data: string): string {
    return `data : DynamicPath(${data})`;
  }
  // DynamicPathWithService
  @Get('/b2/:data')
  getDynamicPathWithservice(@Param('data') data: string): string {
    return this.appService.getDynamicPathWithservice(data);
  }

  // Header : HTML
  @Get('/index')
  @Header('Content-Type', 'text/html')
  index(): string {
    return '<h2>Nest HTML</h2>';
  }

  // Redirect
  @Get('/index/*')
  @Redirect('/', 302)
  indexRedirect(): void {
    return;
  }
}
