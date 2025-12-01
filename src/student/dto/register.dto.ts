import { IsPasswordsMatchingConstraint } from '@/libs/decorators/passwordMatching'
import {
	IsNotEmpty,
	IsString,
	Matches,
	MinLength,
	Validate,
} from 'class-validator'

export class RegisterStudentDto {
	@IsString({ message: 'Имя должно быть строкой.' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения.' })
	representativeName: string

	@IsNotEmpty({ message: 'Номер телефона обязателен для заполнения.' })
	@Matches(
		/^(\+7|8)[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
		{
			message: 'Введите корректный российский номер телефона',
		}
	)
	phoneNumber: string

	@IsString({ message: 'Пароль должен быть строкой.' })
	@IsNotEmpty({ message: 'Пароль обязателен для заполнения.' })
	@MinLength(6, {
		message: 'Пароль должен содержать минимум 6 символов.',
	})
	password: string

	@IsString({ message: 'Пароль подтверждения должен быть строкой.' })
	@IsNotEmpty({ message: 'Поле подтверждения пароля не может быть пустым.' })
	@MinLength(6, {
		message: 'Пароль подтверждения должен содержать не менее 6 символов.',
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Пароли не совпадают.',
	})
	repeatPassword: string
}
