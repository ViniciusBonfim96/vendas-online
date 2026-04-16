import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { Controller } from '@nestjs/common';

@Roles(UserType.User)
@Controller('cart')
export class CartController {}
