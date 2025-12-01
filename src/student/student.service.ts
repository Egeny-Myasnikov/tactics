import { normalizePhoneNumber } from '@/utils/phone.utils'
import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as argon2 from 'argon2'
import { Model } from 'mongoose'
import { RegisterStudentDto } from './dto/register.dto'
import { UpdateStudentDto } from './dto/update.dto'
import { Student, StudentLean } from './entities/student.entity'

@Injectable()
export class StudentService {
	constructor(
		@InjectModel(Student.name) private studentModel: Model<Student>
	) {}
	async findByPhoneNumber(phoneNumber: string) {
		const phone = await this.studentModel.findOne({ phoneNumber })
		return phone
	}
	//
	async register(dto: RegisterStudentDto): Promise<Student> {
		const phone = normalizePhoneNumber(dto.phoneNumber)

		const isExistPhone = await this.findByPhoneNumber(phone)
		if (!!isExistPhone) {
			throw new ConflictException(
				'Регистрация не удалась. Пользователь с таким номером телефона уже существует. Пожалуйста, используйте другой номер телефона или войдите в систему.'
			)
		}
		const passHash = await argon2.hash(dto.password)
		const createdStudent = await this.studentModel.create({
			...dto,
			phoneNumber: phone,
			password: passHash,
		})

		return createdStudent
	}

	async updateProfile(id: string, dto: UpdateStudentDto) {
		const updatedStudent = await this.studentModel.findByIdAndUpdate(id, dto, {
			new: true,
			runValidators: true,
		})
		if (!updatedStudent) {
			throw new NotFoundException(`Тренер с id = ${id} не найден.`)
		}
		return updatedStudent
	}

	async login(
		dto: Pick<RegisterStudentDto, 'phoneNumber' | 'password'>
	): Promise<StudentLean> {
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

	async findById(id: string): Promise<Student | null> {
		return this.studentModel.findById(id)
	}
}
