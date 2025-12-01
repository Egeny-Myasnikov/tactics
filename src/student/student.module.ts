import { JwtAuthModule } from '@/auth/jwt-auth.module'
import { CookieUtils } from '@/utils/cookie.utils'
import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Student, StudentSchema } from './entities/student.entity'
import { StudentController } from './student.controller'
import { StudentService } from './student.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
		forwardRef(() => JwtAuthModule),
	],
	controllers: [StudentController],
	providers: [StudentService, CookieUtils],
	exports: [StudentService, MongooseModule, CookieUtils],
})
export class StudentModule {}
