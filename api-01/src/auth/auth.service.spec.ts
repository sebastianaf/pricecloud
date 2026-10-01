import { AuthService } from './auth.service';
import { LoginEventInterface } from './interfaces/login-event.interface';
import { IpInfo2Interface } from '../common/interfaces/ip-info.interface';
import { User } from '../user/entities/user.entity';

/**
 * Regresion de un 500 en produccion: cuando ipinfo.io devolvia 429 por limite
 * de cuota, `getIpInfo` retornaba null y `createLogin` desestructuraba ese
 * null, asi que el login fallaba entero por un dato de telemetria.
 *
 * Se instancia por prototipo en vez de montar el modulo de Nest: `createLogin`
 * solo toca `userService.addLoginCount` y `loginRepository.save`, y levantar el
 * contenedor de DI obligaria a simular once dependencias para probar un metodo
 * que usa dos.
 */
describe('AuthService.createLogin', () => {
  const buildService = () => {
    const saved: any[] = [];
    const service: AuthService = Object.create(AuthService.prototype);

    (service as any).loginRepository = {
      save: jest.fn(async (row: any) => {
        saved.push(row);
        return row;
      }),
    };
    (service as any).userService = { addLoginCount: jest.fn(async () => undefined) };

    return { service, saved };
  };

  const user = { id: 'u-1' } as User;

  it('registra el acceso aunque la geolocalizacion venga nula (429 del proveedor)', async () => {
    const { service, saved } = buildService();

    const ipInfo: IpInfo2Interface = {
      ipInfo: null,
      userAgent: { browser: 'Chrome' } as any,
    };

    await expect(service.createLogin(ipInfo, user)).resolves.not.toThrow();

    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      event: LoginEventInterface.login,
      ip: null,
      location: null,
      timezone: null,
    });
  });

  it('no inventa la cadena "null" cuando falta la ciudad', async () => {
    const { service, saved } = buildService();

    await service.createLogin(
      {
        ipInfo: {
          city: null,
          country: 'CO',
          timezone: 'America/Bogota',
          ip: '203.0.113.7',
        } as any,
        userAgent: null,
      },
      user,
    );

    // La plantilla original producia "null CO": `${`${city} `}` no
    // cortocircuita porque la cadena "null " es truthy.
    expect(saved[0].location).toBe('CO');
  });

  it('compone ciudad y pais cuando ambos llegan', async () => {
    const { service, saved } = buildService();

    await service.createLogin(
      {
        ipInfo: {
          city: 'Bogota',
          country: 'CO',
          timezone: 'America/Bogota',
          ip: '203.0.113.7',
        } as any,
        userAgent: null,
      },
      user,
    );

    expect(saved[0].location).toBe('Bogota CO');
    expect(saved[0].ip).toBe('203.0.113.7');
  });
});
