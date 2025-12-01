import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CookieUtils } from '@/utils/cookie.utils'
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
import { StudentJwtAuthService } from '../auth/jwt-auth.service'
import { RegisterStudentDto } from './dto/register.dto'
import { UpdateStudentDto } from './dto/update.dto'
import { StudentService } from './student.service'

@Controller('student')
export class StudentController {
	constructor(
		private readonly studentService: StudentService,
		private readonly studentJwtAuthService: StudentJwtAuthService,
		private readonly cookieUtils: CookieUtils
	) {}

	@Post()
	async register(
		@Body() dto: RegisterStudentDto,
		@Res({ passthrough: true }) response: Response
	) {
		const student = (await this.studentService.register(dto)).toObject()
		const token = await this.studentJwtAuthService.generateToken(student)

		const cookieOptions = this.cookieUtils.getCookieOptions(7)
		response.cookie('access_token', token.access_token, cookieOptions)

		const { password, ...studentWithoutPassword } = student
		return {
			...studentWithoutPassword,
			...token,
			message: 'Регистрация успешна.',
		}
	}
	@Post('login')
	async login(
		@Body() dto: Pick<RegisterStudentDto, 'phoneNumber' | 'password'>,
		@Res({ passthrough: true }) response: Response
	) {
		const student = await this.studentService.login(dto)
		const token = await this.studentJwtAuthService.generateToken(student)

		const cookieOptions = this.cookieUtils.getCookieOptions(7)
		response.cookie('access_token', token.access_token, cookieOptions)

		return {
			...student,
			...token,
			message: 'Вход выполнен успешно',
		}
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	updateProfile(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
		return this.studentService.updateProfile(id, dto)
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
