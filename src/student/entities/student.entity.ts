import { RoleEnum } from '@/constants/roles.enum'
import { SpecializationEnum } from '@/constants/specializations.enum'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export interface StudentLean {
	_id: Types.ObjectId
	representativeName: string
	phoneNumber: string
	role: RoleEnum.Student
	fullName?: string
	picture?: string
	dateOfBirth?: Date
	city?: string
	club?: string
	specialization?: SpecializationEnum[]
	__v: number
}

@Schema({ timestamps: true })
export class Student extends Document {
	@Prop({ default: '' })
	fullName: string

	@Prop({ required: true })
	representativeName: string

	@Prop({ required: true, unique: true })
	phoneNumber: string

	@Prop({ required: true })
	password: string

	@Prop({
		default: RoleEnum.Student,
		required: true,
		enum: RoleEnum,
		type: String,
	})
	role: RoleEnum.Student

	@Prop({ default: '' })
	picture: string

	@Prop({ type: Date })
	dateOfBirth?: Date

	@Prop()
	city?: string

	@Prop()
	club?: string

	@Prop({ type: [String], enum: SpecializationEnum })
	specialization: SpecializationEnum[]
}
export const StudentSchema = SchemaFactory.createForClass(Student)
