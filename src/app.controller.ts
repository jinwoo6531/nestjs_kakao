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
  Query,
} from '@nestjs/common';
import { AppService, MyService, KakaoLogin } from './app.service';
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
    private readonly kakaoLogin: KakaoLogin,
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

  @Get('kakaoLogin')
  @Header('Content-Type', 'text/html')
  getKakaoLoginPage(): string {
    return `
      <div>
        <h1>카카오 로그인</h1>

        <form action="/kakaoLoginLogic" method="GET">
          <input type="submit" value="카카오로그인" />
        </form>

        <form action="/kakaoLogout" method="GET">
          <input type="submit" value="카카오로그아웃 및 연결 끊기" />
        </form>
    `;
  }
  @Get('kakaoLoginLogic')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = ''; // * 입력필요
    // 카카오 로그인 RedirectURI 등록
    const _redirectUrl = 'http://127.0.0.1:3000/kakaoLoginLogicRedirect';
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }
  @Get('kakaoLoginLogicRedirect')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogicRedirect(@Query() qs, @Res() res): void {
    console.log(qs.code);
    const _restApiKey = ''; // * 입력필요
    const _redirect_uri = 'http://127.0.0.1:3000/kakaoLoginLogicRedirect';
    const _hostName = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${_restApiKey}&redirect_uri=${_redirect_uri}&code=${qs.code}`;
    const _headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };
    this.kakaoLogin
      .login(_hostName, _headers)
      .then((e) => {
        console.log(`TOKEN : ${e.data['access_token']}`);
        this.kakaoLogin.setToken(e.data['access_token']);
        return res.send(`
          <div>
            <h2>축하합니다!</h2>
            <p>카카오 로그인 성공하였습니다 :)</p>
            <a href="/kakaoLogin">메인으로</a>
          </div>
        `);
      })
      .catch((err) => {
        console.log(err);
        return res.send('error');
      });
  }
  // 카카오 로그인 -> 고급에서 로그아웃 Logout Redirect URI 설정 필요
  @Get('kakaoLogout')
  kakaoLogout(@Res() res): void {
    console.log(`LOGOUT TOKEN : ${this.kakaoLogin.accessToken}`);
    // // 로그아웃 -(1) 연결 끊기
    this.kakaoLogin
      .deleteLog()
      .then((e) => {
        return res.send(`
          <div>
            <h2>로그아웃 완료(연결끊기)</h2>
            <a href="/kakaoLogin">메인 화면으로</a>
          </div>
        `);
      })
      .catch((e) => {
        console.log(e);
        return res.send('DELETE ERROR');
      });
    // // 로그아웃 -(2) 토큰 만료
    // this.kakaoLogin
    //   .logout()
    //   .then((e) => {
    //     return res.send(`
    //       <div>
    //         <h2>로그아웃 완료(토큰만료)</h2>
    //         <a href="/kakaoLogin">메인 화면으로</a>
    //       </div>
    //     `);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //     return res.send('LogOUT ERROR');
    //   });
  }
}
