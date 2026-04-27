import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from '@/order/order.service';
import { CreateOrderDto } from '@/order/dto/createOrder.dto';
import { UserId } from '@/decorators/user-id-decorator';
import { OrderEntity } from '@/order/entity/order.entity';
import { Roles } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { ReturnOrderDto } from '@/order/dto/returnOrder.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @UserId() userId: number,
  ) {
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  async findOrdersByUserId(@UserId() userId: number): Promise<OrderEntity[]> {
    return this.orderService.findOrdersByUserId(userId);
  }

  @Roles(UserType.Admin)
  @Get('/all')
  async findAllOrders(): Promise<ReturnOrderDto[]> {
    return (await this.orderService.findAllOrders()).map(
      (order) => new ReturnOrderDto(order),
    );
  }

  @Roles(UserType.Admin)
  @Get('/:orderId')
  async findOrderById(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<ReturnOrderDto> {
    const order = await this.orderService.findOrderById(orderId);

    if (!order) {
      throw new NotFoundException(`orderId: ${orderId} not found`);
    }

    return new ReturnOrderDto(order);
  }
}
