import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle(`Book Loan API's`)
    .setDescription(`Book Loan API Specification is detailed here.`)
    .setVersion(configService.get('APP_VERSION') || '1.0')
    .addTag('book-loan')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('APP_PORT') || 3000);
}
bootstrap();
