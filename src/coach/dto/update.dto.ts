import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsDate,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'
import { RegisterCoachDto } from './register.dto'
import { SpecializationEnum } from '../../constants/specializations.enum'

export class UpdateCoachDto extends PartialType(RegisterCoachDto) {
	@IsOptional()
	@IsString({ message: 'picture должен быть строкой.' })
	picture?: string

	@IsOptional()
	@IsString()
	playingCareer?: string

	@IsOptional()
	@IsString()
	coachingCareer?: string

	@IsOptional()
	@IsArray()
	@IsEnum(SpecializationEnum, { each: true })
	specialization?: SpecializationEnum[]

	@IsOptional()
	@Type(() => Date)
	@IsDate()
	dateOfBirth?: Date

	@IsOptional()
	@IsNumber()
	price?: number

	@IsOptional()
	@IsNumber()
	experience?: number
}
