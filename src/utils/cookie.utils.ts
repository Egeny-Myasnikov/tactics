import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CookieOptions } from 'express'

@Injectable()
export class CookieUtils {
	constructor(private readonly configService: ConfigService) {}

	getCookieOptions(maxAgeDays: number = 7) {
		const isProduction =
			this.configService.getOrThrow<string>('NODE_ENV') === 'production'

		return {
			httpOnly: false,
			secure: true,
			sameSite: 'none',
			maxAge: maxAgeDays * 24 * 60 * 60 * 1000,
			domain: 'localhost',
		} as CookieOptions
	}
}
