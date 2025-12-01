import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CoachLean } from '../coach/entities/coach.entity'
import { StudentLean } from '../student/entities/student.entity'

@Injectable()
export class CoachJwtAuthService {
	constructor(private readonly jwtService: JwtService) {}
	async generateToken(coach: CoachLean): Promise<{ access_token: string }> {
		const payload = {
			sub: coach._id,
			phoneNumber: coach.phoneNumber,
			role: coach.role,
		}
		return {
			access_token: this.jwtService.sign(payload),
		}
	}
	async verifyToken(token: string): Promise<CoachLean> {
		return this.jwtService.verify(token)
	}
}
@Injectable()
export class StudentJwtAuthService {
	constructor(private readonly jwtService: JwtService) {}
	async generateToken(student: StudentLean): Promise<{ access_token: string }> {
		const payload = {
			sub: student._id,
			phoneNumber: student.phoneNumber,
			role: student.role,
		}
		return {
			access_token: this.jwtService.sign(payload),
		}
	}
	async verifyToken(token: string): Promise<CoachLean> {
		return this.jwtService.verify(token)
	}
}
