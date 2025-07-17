import { NestMiddleware, Inject } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { DataSource, QueryRunner } from "typeorm";

export default class QueryRunnerMiddleware implements NestMiddleware {
  constructor(
    @Inject("ConnectionStore")
    private readonly connectionStore: AsyncLocalStorage<{
      queryRunner: QueryRunner;
    }>,
    private readonly datasource: DataSource
  ) {}

  use(req: any, res: any, next: (error?: any) => void) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    this.connectionStore.run({ queryRunner }, () => next());
  }
}
