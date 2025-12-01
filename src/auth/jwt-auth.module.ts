import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { CoachJwtAuthService, StudentJwtAuthService } from './jwt-auth.service'
import { CoachJwtStrategy, StudentJwtStrategy } from './jwt.strategy'
import { CoachModule } from '../coach/coach.module'
import { StudentModule } from '../student/student.module'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) =>
				({
					secret: configService.getOrThrow<string>('JWT_SECRET'),
					signOptions: {
						expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
					},
				}) as any,
			inject: [ConfigService],
		}),
		CoachModule,
		StudentModule,
	],
	providers: [
		CoachJwtAuthService,
		CoachJwtStrategy,
		StudentJwtAuthService,
		StudentJwtStrategy,
	],
	exports: [CoachJwtAuthService, StudentJwtAuthService],
})
export class JwtAuthModule {}
