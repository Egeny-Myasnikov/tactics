import { JwtAuthModule } from '@/auth/jwt-auth.module'
import { CookieUtils } from '@/utils/cookie.utils'
import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CoachController } from './coach.controller'
import { CoachService } from './coach.service'
import { Coach, CoachSchema } from './entities/coach.entity'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Coach.name, schema: CoachSchema }]),
		forwardRef(() => JwtAuthModule),
	],
	controllers: [CoachController],
	providers: [CoachService, CookieUtils],
	exports: [CoachService, MongooseModule, CookieUtils],
})
export class CoachModule {}
