import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Para leer metadatos (roles)

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos de la ruta (definidos con @Roles())
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      'roles', // Usa la clave ROLES_KEY, pero aquí se pone directamente la cadena
      [
        context.getHandler(), // Para leer el decorador de la función del controlador
        context.getClass(),   // Para leer el decorador de la clase del controlador
      ],
    );

    // Si no hay roles definidos para la ruta, permite el acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtiene el usuario autenticado del request (añadido por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // Verifica si el rol del usuario está incluido en los roles requeridos
    return requiredRoles.some((role) => user.rol?.includes(role)); // Asegúrate de que user.rol exista y sea un array o string comparable
  }
}