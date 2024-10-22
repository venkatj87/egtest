import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { config } from 'dotenv';

config();

async function bootstrap(): Promise<void> {

  const app: INestApplication = await NestFactory.create(AppModule);

  // Enable CORS: Safeguard by allowing only specific origins to prevent unauthorized domain requests.
  // Suggestion: You can also restrict this on a server level by allowing only limited IPs.
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Replace with your specific domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true, // Allow cookies to be sent along with requests
  });

  // Start the application and listen on the specified port or default to 3001
  const port: number = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
}

// Bootstrap the application
bootstrap();