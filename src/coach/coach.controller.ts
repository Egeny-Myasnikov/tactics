import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'
import { CoachService } from './coach.service'
import { RegisterCoachDto } from './dto/register.dto'
import { UpdateCoachDto } from './dto/update.dto'
import { CoachJwtAuthService } from '../auth/jwt-auth.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CookieUtils } from '../utils/cookie.utils'

@Controller('coach')
export class CoachController {
	constructor(
		private readonly coachService: CoachService,
		private readonly coachJwtAuthService: CoachJwtAuthService,
		private readonly cookieUtils: CookieUtils
	) {}

	@Post()
	async register(
		@Body() dto: RegisterCoachDto,
		@Res({ passthrough: true }) response: Response
	) {
		const coach = (await this.coachService.register(dto)).toObject()
		const token = await this.coachJwtAuthService.generateToken(coach)

		const cookieOptions = this.cookieUtils.getCookieOptions(7)
		response.cookie('access_token', token.access_token, cookieOptions)

		const { password, ...coachWithoutPassword } = coach
		return {
			...coachWithoutPassword,
			...token,
			message: 'Регистрация успешна.',
		}
	}
	@Post('login')
	async login(
		@Body() dto: Pick<RegisterCoachDto, 'phoneNumber' | 'password'>,
		@Res({ passthrough: true }) response: Response
	) {
		const coach = await this.coachService.login(dto)
		const token = await this.coachJwtAuthService.generateToken(coach)

		const cookieOptions = this.cookieUtils.getCookieOptions(7)
		response.cookie('access_token', token.access_token, cookieOptions)

		return {
			...coach,
			...token,
			message: 'Вход выполнен успешно',
		}
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	updateProfile(@Param('id') id: string, @Body() dto: UpdateCoachDto) {
		return this.coachService.updateProfile(id, dto)
	}

	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('access_token')
		return { message: 'Выход выполнен успешно' }
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	getProfile(@Req() req: { user: any }) {
		return req.user
	}

	//для проверки аутентификации
	@Get('check-auth')
	@UseGuards(JwtAuthGuard)
	checkAuth(@Req() req: { user: any }) {
		return {
			authenticated: true,
			user: req.user,
		}
	}
}
