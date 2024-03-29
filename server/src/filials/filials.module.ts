import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { FilialsService } from './filials.service';
import { FilialsResolver } from './filials.resolver';
import { Filial, FilialSchema } from './mongo/filial.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Filial.name,
        schema: FilialSchema,
      },
    ]),
  ],
  providers: [FilialsResolver, FilialsService],
  exports: [FilialsService],
})
export class FilialsModule {}
