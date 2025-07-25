import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'; // Para acceder al secreto JWT
import { AuthModuleService } from '../auth-module.service'; // Para validar el usuario

// Define la interfaz del payload que esperas en tu JWT
interface JwtPayload {
  sub: number; // ID del usuario
  email: string;
  rol: string; // 'estudiante', 'administrador', 'super_admin', etc.
  iat?: number; // Issued At (opcional)
  exp?: number; // Expiration (opcional)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService, // Inyecta ConfigService
    private authModuleService: AuthModuleService, // Inyecta el servicio de autenticación
  ) {
    super({
      // Extrae el JWT del encabezado Authorization como Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // El secreto para firmar y verificar el token
      secretOrKey: configService.get<string>('JWT_SECRET'), // Usa la variable de entorno
      // Si el token expira, Passport lanzará un error automáticamente
      ignoreExpiration: false,
    });
  }

  // Este método se ejecuta DESPUÉS de que el JWT es decodificado y verificado
  // El 'payload' es el objeto decodificado del JWT
  async validate(payload: JwtPayload) {
    // Aquí puedes realizar una validación adicional, por ejemplo,
    // verificar si el usuario todavía existe en la base de datos o si su cuenta está activa.
    const user = await this.authModuleService.validateUserById(payload.sub, payload.rol);

    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado.');
    }

    // Si la validación es exitosa, el objeto 'user' (o el payload completo)
    // se adjunta a 'request.user' en el controlador.
    return { id: payload.sub, email: payload.email, rol: payload.rol }; // Puedes devolver el usuario completo o solo el payload
  }
}