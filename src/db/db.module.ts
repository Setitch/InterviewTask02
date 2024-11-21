import { Logger, Module, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { join } from 'node:path';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { MigrationError, SequelizeStorage, Umzug } from 'umzug';
import { HistoryEntity } from './entities/history.entity';
import { MigrationModuleType, migrationsLanguageSpecificHelp } from './types/migration.types';

const UmZugLogger: Logger & {
  info(message: any, context?: string): void;
  info(message: any, ...optionalParams: [...any, string?]): void;
} = new Logger('UmZug') as any;
(UmZugLogger as any).info = UmZugLogger.log;


const MODELS = [
  HistoryEntity,
];
const SERVICES: Provider[] = [
];
const VALUES: Provider[] = [
  {
    provide: 'DB_ENTITY--HISTORY',
    useValue: HistoryEntity,
  },
];

const SEQUELIZE: Provider[] = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const options = {
        dialect: process.env.DB_DIALECT ? (process.env.DB_DIALECT as Dialect) : 'sqlite',
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number.parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'root-pass',
        database: process.env.DB_DATABASE || 'walk',
        ...(process.env.DB_SSL && process.env.DB_SSL.toLocaleLowerCase() === 'true' && {
          ssl: true,
          dialectOptions: {
            ssl: {
              require: true,
            },
            decimalNumbers: true,
          },
        }),
        ...(!(process.env.DB_SSL && process.env.DB_SSL.toLocaleLowerCase() === 'true') && {
          dialectOptions: {
            decimalNumbers: true,
          },
        }),
        pool: {
          max: 16,
          min: 1,
          idle: 30_000,
          acquire: 10_000,
        },
        logging: process.env?.DB_LOGGING?.toLocaleLowerCase() === 'true',
        benchmark: process.env?.DB_BENCHMARK?.toLocaleLowerCase() === 'true',
      };
      
      const sequelize = process.env.node_env === 'test' ? (new Sequelize(`sqlite:${ (process.env?.DB_TEST || 'memory')?.toLocaleLowerCase() === 'memory' ? ':memory:' : process.env.DB_TEST }`)) : new Sequelize(options);
      
      sequelize.addModels(MODELS);
      
      if (process.env.node_env === 'test') {
        await sequelize.sync({ force: true });
      } else {
        // await sequelize.sync({force: true});
        await sequelize.sync();
      }
      
      return sequelize;
    },
  },
];


@Module({
  imports: [
    // EMITTER,
  ],
  controllers: [],
  providers: [...VALUES, ...SERVICES, ...SEQUELIZE],
  exports: [...VALUES, ...SERVICES, ...SEQUELIZE],
})
export class DbModule {
  constructor(
    private moduleRef: ModuleRef,
  ) {}
  
  async onApplicationBootstrap() {
    const sequelize = this.moduleRef.get<Sequelize>('SEQUELIZE');
    try {
      await sequelize.query('SELECT 1');
      
      await this.migrate();
    } catch (err) {
      if (err instanceof MigrationError) {
        (new Logger('DbModule - Migrations')).error(`${err?.message}`);
      } else {
        (new Logger('DbModule')).error(`Could not connect with database: ${(err as Error)?.message}`);
      }
      console.log(err);
      process.exit(1);
    }
    (new Logger('DbModule')).debug('Database Started');
  }
  
  protected async migrate() {
    const sequelize = this.moduleRef.get<Sequelize>('SEQUELIZE');
    
    const oldLogged = sequelize.options.logging;
    sequelize.options.logging = false;
    
    console.log('Migration check on:', sequelize?.getDialect());
    
    if (sequelize?.getDialect() !== 'sqlite') {
      require('ts-node/register');
      const umzug = new Umzug({
        storage: new SequelizeStorage({ sequelize }),
        context: sequelize.getQueryInterface(),
        migrations: {
          glob: ['*.{t,j}s', { cwd: join(__dirname, 'migrations'), ignore: ['*.d.ts'] }],
          resolve: (res) => {
            if (!res.path) {
              throw new Error(`Can't use default resolver for non-filesystem migrations`);
            }
            const properPath = join(__dirname, 'migrations', res.name);
            
            const module: MigrationModuleType = (() => {
              try {
                
                return require(properPath);
              } catch (e) {
                if (e instanceof SyntaxError && res.path.endsWith('.ts')) {
                  e.message += '\n\n' + migrationsLanguageSpecificHelp['.ts'];
                }
                throw e;
                
              }
            })();
            
            return {
              // adjust the parameters Umzug will
              // pass to migration methods when called
              name: res.name,
              path: properPath,
              up: async () => module.migration.up(res.context),
              down: async () => module.migration.down(res.context),
            };
          },
        },
        logger: UmZugLogger,
      });
      umzug.debug.enabled = false;
      umzug.on('migrating', ev => console.log({ name: ev.name, path: ev.path }));
      
      await umzug.up();
    }
    
    sequelize.options.logging = oldLogged;
  }
}
