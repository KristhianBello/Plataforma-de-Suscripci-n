import {
  Controller,
  Post,
  Body,
  Headers,
  RawBody,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth-module/guards/jwt-auth.guard';
import { User } from '../auth-module/decorators/user.decorator';
import { JwtPayload } from '../auth-module/interfaces/jwt-payload.interface';
import { TipoProductoPagado } from './entities/transaccion.entity';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createPaymentIntent(
    @User() user: JwtPayload,
    @Body() body: {
      monto: number;
      tipo: TipoProductoPagado;
      suscripcionId?: number;
      cursoId?: number;
    },
  ) {
    return this.stripeService.createPaymentIntent(
      user.sub,
      body.monto,
      body.tipo,
      body.suscripcionId,
      body.cursoId,
    );
  }

  @Post('create-subscription')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createSubscription(
    @User() user: JwtPayload,
    @Body() body: {
      priceId: string;
      suscripcionId: number;
    },
  ) {
    return this.stripeService.createSubscription(
      user.sub,
      body.priceId,
      body.suscripcionId,
    );
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer,
  ) {
    await this.stripeService.handleWebhook(signature, payload);
    return { received: true };
  }

  @Post('cancel-subscription')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@Body('subscriptionId') subscriptionId: string) {
    await this.stripeService.cancelSubscription(subscriptionId);
    return { message: 'Subscription canceled successfully' };
  }
}
