import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('todomanager后台管理API')
    .setDescription('后台服务端调用文档')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app,options);
  SwaggerModule.setup('api-docs',app,document);

  await app.listen(3000);
  console.log("http://localhost:3000/api-docs")
}
bootstrap();
