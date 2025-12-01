import { SpecializationEnum } from '@/constants/specializations.enum'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { RegisterStudentDto } from './register.dto'

export class UpdateStudentDto extends PartialType(RegisterStudentDto) {
	@IsOptional()
	@IsString({ message: 'picture должен быть строкой.' })
	picture?: string

	@IsOptional()
	@IsArray()
	@IsEnum(SpecializationEnum, { each: true })
	specialization?: SpecializationEnum[]

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	dateOfBirth?: Date

	@IsOptional()
	@IsString({ message: 'Имя должно быть строкой.' })
	fullName?: string

	@IsOptional()
	@IsString({ message: 'Город должен быть строкой.' })
	city?: string

	@IsOptional()
	@IsString({ message: 'Клуб должен быть строкой.' })
	club?: string
}
