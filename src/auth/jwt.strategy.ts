import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { CoachService } from '../coach/coach.service'
import { CoachLean } from '../coach/entities/coach.entity'
import { StudentService } from '../student/student.service'
import { StudentLean } from '../student/entities/student.entity'

@Injectable()
export class CoachJwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly coachService: CoachService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				request => {
					return request?.cookies?.access_token
				},
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
		})
	}

	async validate(payload: any): Promise<CoachLean> {
		const coach = await this.coachService.findById(payload.sub)
		if (!coach) {
			throw new UnauthorizedException('Пользователь не найден')
		}
		const { password, ...result } = coach.toObject()
		return result as CoachLean
	}
}
@Injectable()
export class StudentJwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly studentService: StudentService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				request => {
					return request?.cookies?.access_token
				},
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
		})
	}

	async validate(payload: any): Promise<StudentLean> {
		const student = await this.studentService.findById(payload.sub)
		if (!student) {
			throw new UnauthorizedException('Пользователь не найден')
		}
		const { password, ...result } = student.toObject()
		return result as StudentLean
	}
}
