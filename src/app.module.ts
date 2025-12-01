import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { JwtAuthModule } from './auth/jwt-auth.module'
import { CoachModule } from './coach/coach.module'
import { StudentModule } from './student/student.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.getOrThrow<string>('MONGODB_URI'),
				retryAttempts: 5,
				retryDelay: 3000,
				connectionFactory: connection => {
					connection.on('connected', () => {
						console.log('MongoDB connected successfully')
					})
					connection.on('error', error => {
						console.log('MongoDB connection error: ', error)
					})
					return connection
				},
			}),
			inject: [ConfigService],
		}),
		CoachModule,
		JwtAuthModule,
		StudentModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
