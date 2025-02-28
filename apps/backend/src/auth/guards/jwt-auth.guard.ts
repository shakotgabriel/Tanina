import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const response = context.switchToHttp().getResponse<Response>();
      
      // If it's an API request (checking for common API paths or Accept header)
      const request = context.switchToHttp().getRequest();
      const isApiRequest = request.path.startsWith('/api') || 
                          request.headers.accept?.includes('application/json');
      
      if (isApiRequest) {
        throw new UnauthorizedException();
      }
      
      // For regular requests, redirect to login page
      response.redirect('/auth/login');
      return null;
    }
    return user;
  }
}
