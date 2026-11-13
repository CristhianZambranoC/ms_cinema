import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import axios from 'axios';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

interface PermissionValidationResponse {
  allowed: boolean;
}

@Injectable()
export class SecurityGuard implements CanActivate {
  private readonly logger = new Logger(SecurityGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /*
    // Este guard solo valida solicitudes HTTP; los eventos WebSocket se manejan en el gateway.
    if (context.getType() !== 'http') return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request.headers.authorization);

    const securityBaseUrl = this.configService.get<string>('MS_SECURITY');
    if (!securityBaseUrl) {
      this.logger.error('MS_SECURITY no esta configurada');
      throw new ServiceUnavailableException('Servicio de seguridad no configurado');
    }

    try {
      const response = await axios.post<PermissionValidationResponse>(
        `${securityBaseUrl}/api/internal/security/permissions-validation`,
        {
          // La tabla de permisos de ms_security registra rutas como /movies.
          // No se incluye el query string porque no forma parte del permiso.
          url: request.path,
          method: request.method,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );

      if (response.data.allowed === true) return true;

      throw new ForbiddenException('No tiene permiso para acceder a este recurso');
    } catch (error) {
      // No se transforma el rechazo normal de permisos en un error de infraestructura.
      if (error instanceof ForbiddenException) throw error;

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        this.logger.warn(
          `Validacion de permisos rechazada: ${status ?? error.code ?? 'sin respuesta'}`,
        );

        if (status === 401) {
          throw new UnauthorizedException('Token invalido o expirado');
        }
        if (status === 403) {
          throw new ForbiddenException('No tiene permiso para acceder a este recurso');
        }
      }

      this.logger.error('No fue posible consultar el servicio de seguridad');
      throw new ServiceUnavailableException('Servicio de seguridad no disponible');
    }*/
   return true; // Se desactiva temporalmente la validación de permisos para poder probar el resto del sistema.
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization) {
      throw new UnauthorizedException('Token de autorizacion faltante');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token || authorization.split(' ').length !== 2) {
      throw new UnauthorizedException('Formato de Authorization invalido');
    }

    return token;
  }
}
