import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as argon2 from 'argon2'
import { Model } from 'mongoose'
import { normalizePhoneNumber } from '../utils/phone.utils'
import { RegisterCoachDto } from './dto/register.dto'
import { UpdateCoachDto } from './dto/update.dto'
import { Coach, CoachLean } from './entities/coach.entity'

@Injectable()
export class CoachService {
	constructor(@InjectModel(Coach.name) private coachModel: Model<Coach>) {}
	async findByPhoneNumber(phoneNumber: string) {
		const phone = await this.coachModel.findOne({ phoneNumber })
		return phone
	}
	//
	async register(dto: RegisterCoachDto): Promise<Coach> {
		const phone = normalizePhoneNumber(dto.phoneNumber)

		const isExistPhone = await this.findByPhoneNumber(phone)
		if (!!isExistPhone) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким номером телефона уже существует. Пожалуйста, используйте другой номер телефона или войдите в систему.'
			)
		}
		const passHash = await argon2.hash(dto.password)
		const createdCoach = await this.coachModel.create({
			...dto,
			phoneNumber: phone,
			password: passHash,
		})

		return createdCoach
	}

	async updateProfile(id: string, dto: UpdateCoachDto) {
		const updatedCoach = await this.coachModel.findByIdAndUpdate(id, dto, {
			new: true,
			runValidators: true,
		})
		if (!updatedCoach) {
			throw new NotFoundException(`Тренер с id = ${id} не найден.`)
		}
		return updatedCoach
	}

	async login(
		dto: Pick<RegisterCoachDto, 'phoneNumber' | 'password'>
	): Promise<CoachLean> {
		const phone = normalizePhoneNumber(dto.phoneNumber)
		const user = await this.findByPhoneNumber(phone)
		if (!user) {
			throw new NotFoundException(
				'Пользователя с таким номером телефона не существует. Пожалуйста, используйте другой номер телефона или зарегистрируйтесь.'
			)
		}

		if (
			!user.password ||
			typeof user.password !== 'string' ||
			!user.password.startsWith('$')
		) {
			console.error('INVALID HASH FORMAT:', user.password)
			throw new ConflictException(
				'Ошибка аутентификации. Пожалуйста, обратитесь в поддержку.'
			)
		}

		try {
			const verifyPassword = await argon2.verify(user.password, dto.password)

			if (!verifyPassword) {
				throw new ConflictException('Неверный пароль.')
			}
			const { password, ...userWithoutPassword } = user.toObject()
			return userWithoutPassword
		} catch (error) {
			console.error('Argon2 verification error:', error.message)
			throw new ConflictException('Неверный пароль.')
		}
	}

	async findById(id: string): Promise<Coach | null> {
		return this.coachModel.findById(id)
	}
}
