import { Controller } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/models/user.module';
import  { Crud } from 'nestjs-mongoose-crud';


@Crud({
    model: User
})

@Controller('users')
export class UsersController {
    constructor(@InjectModel(User) private readonly model){ }
}
