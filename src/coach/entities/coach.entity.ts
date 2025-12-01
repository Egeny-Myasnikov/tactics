import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { RoleEnum } from '../../constants/roles.enum'
import { SpecializationEnum } from '../../constants/specializations.enum'

export interface CoachLean {
	_id: Types.ObjectId
	fullName: string
	phoneNumber: string
	role: RoleEnum.Coach
	picture?: string
	dateOfBirth?: Date
	specialization?: SpecializationEnum[]
	playingCareer?: string
	coachingCareer?: string
	price?: number
	experience?: number
	__v: number
}

@Schema({ timestamps: true })
export class Coach extends Document {
	@Prop({ required: true })
	fullName: string

	@Prop({ required: true, unique: true })
	phoneNumber: string

	@Prop({ required: true })
	password: string

	@Prop({
		default: RoleEnum.Coach,
		required: true,
		enum: RoleEnum,
		type: String,
	})
	role: RoleEnum.Coach

	@Prop({ default: '' })
	picture: string

	@Prop({ type: Date })
	dateOfBirth?: Date

	@Prop({ type: [String], enum: SpecializationEnum })
	specialization: SpecializationEnum[]

	@Prop({ default: '' })
	playingCareer: string

	@Prop({ default: '' })
	coachingCareer: string

	@Prop({ default: 0 })
	price: number

	@Prop({ default: 0 })
	experience: number
}
export const CoachSchema = SchemaFactory.createForClass(Coach)
