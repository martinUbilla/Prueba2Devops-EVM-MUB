import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonaModule } from './persona/persona.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, PersonaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
