import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IsPublic } from '../decorators/is-public.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthRequest } from '../models/auth.request';
import { AuthService } from '../services/auth.service';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: AuthRequest) {
    return await this.authService.login(req.user);
  }
}
