import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessGuard extends AuthGuard('access') {}

@Injectable()
export class AdminGuard extends AuthGuard('admin') {}
