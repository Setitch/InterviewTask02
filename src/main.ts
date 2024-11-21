import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      skipUndefinedProperties: false,
      // we don't use it, allowing original pipes to be used, and the filtered back in interceptor
      // exceptionFactory: (errors: ValidationError[]) => {
      //   return new BadRequestException([...errors]);
      // },
      transform: true,
      whitelist: false, // TODO: after class-validator creator answers us if it would be possible to pass here also string[] for allowed fields, we keep it false now. If that would not be possible - we need to BASE ALL POST/PUT DTOs on one that will allow one field to be used (the field with our *Authorization classes)
    }),
  );
  
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Api Description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  ;
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/app/swagger', app, document);
  
  
  await app.listen(3000);
  const logger = new Logger('Application');
  logger.verbose(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().then(() => {}).catch((err) => {
  console.error(err);
  
  process.exit(err.code || 1);
});
