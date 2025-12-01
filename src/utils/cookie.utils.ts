import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieOptions } from 'express'

@Injectable()
export class CookieUtils {
	constructor(private readonly configService: ConfigService) {}

	getCookieOptions(maxAgeDays: number = 7) {
		const isProduction =
			this.configService.getOrThrow('NODE_ENV') === 'production'

		return {
			httpOnly: true,
			secure: isProduction,
			sameSite: isProduction ? 'none' : ('lax' as const),
			maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
			domain: this.configService.get('COOKIE_DOMAIN'),
		} as CookieOptions
	}
}
