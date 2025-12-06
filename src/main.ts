import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from 'express'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	const allowedOriginsString = config.get<string>('ALLOWED_ORIGINS') || ''
	const allowedOrigins = allowedOriginsString
		? allowedOriginsString.split(',').map(origin => origin.trim())
		: ['http://localhost:5173']

	app.use((req: Request, res: Response, next: NextFunction) => {
		const origin = req.headers.origin as string

		if (origin && allowedOrigins.includes(origin)) {
			res.header('Access-Control-Allow-Origin', origin)
		}
		res.header('Access-Control-Allow-Credentials', 'true')
		res.header(
			'Access-Control-Allow-Methods',
			'GET,POST,PUT,PATCH,DELETE,OPTIONS'
		)
		res.header(
			'Access-Control-Allow-Headers',
			'Content-Type,Authorization,Cookie'
		)

		if (req.method === 'OPTIONS') {
			return res.status(200).send()
		}

		next()
	})

	app.enableCors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
		exposedHeaders: ['Set-Cookie'],
	})

	app.use(cookieParser())

	app.useGlobalPipes(new ValidationPipe())

	const port =
		process.env.PORT || config.get<number>('APPLICATION_PORT') || 4000

	await app.listen(port)
}
bootstrap()
