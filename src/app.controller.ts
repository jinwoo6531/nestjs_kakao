import {
  Controller,
  Get,
  Param,
  Header,
  Redirect,
  Post,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AppService, MyService } from './app.service';
import { Request, Response } from 'express';
import { join } from 'path';

interface PostData {
  data: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly myService: MyService,
  ) {}

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

  // Post Body (1)
  @Post('/data')
  @Header('Content-Type', 'application/json')
  postData(@Body('data') postBody: string): string {
    return JSON.stringify({ data: postBody });
  }
  // Post Body (2)
  @Post('/data2')
  @Header('Content-Type', 'application/json')
  postData2(@Body('data') postBody: string): PostData {
    return { data: postBody };
  }

  // Provider
  @Get('myService')
  getMyService(): string {
    this.myService.setData('Hi ? My Service !');
    return this.myService.getData();
  }
  @Get('myService2')
  getMyService2(): string {
    return this.myService.getData();
  }

  // Static File(HTML)
  @Get('reactjs*') // - 대응 가능한 주소 : /reactjs /reactjs/ /reactjs/1 /reactjs/2
  getReact(@Req() req: Request, @Res() res: Response): void {
    return res.sendFile(join(__dirname, '../views/react/index.html'));
  }
}
