import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		// const request = context.switchToHttp().getRequest()
		// console.log('Request Headers:', request.headers)
		// console.log('Authorization Header:', request.headers.authorization)
		return super.canActivate(context)
	}

	handleRequest(err: any, user: any, info: any) {
		if (err || !user) {
			//  console.log('JWT Error:', err?.message || info?.message)
			throw err || new UnauthorizedException('Необходима авторизация')
		}
		return user
	}
}
