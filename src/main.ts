import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	app.enableCors({
		origin: [
			config.getOrThrow<string>('ALLOWED_ORIGIN'),
			'http://localhost:3000',
			'http://localhost:3001',
		],
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
	})

	app.use(cookieParser())

	app.useGlobalPipes(new ValidationPipe())

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT') ?? 4000)
}
bootstrap()
