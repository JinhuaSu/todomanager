import { prop } from '@typegoose/typegoose'
import { ApiModel } from '@nestjs/swagger'

export class User {
    @prop()
    username: string

    @prop()
    password: string
}