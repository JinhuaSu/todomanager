import { Module, Global } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from './models/user.module';

const models = TypegooseModule.forFeature([User])

@Global()
@Module({
  imports: [
      TypegooseModule.forRoot('mongodb://localhost/todomanager', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }),
      models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
