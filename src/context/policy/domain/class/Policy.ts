import { UUID } from 'node:crypto';

export class Policy {
  constructor(
    private readonly id: UUID,
    private readonly rutTitular: string,
    private readonly fechaEmision: string,
    private readonly planSalud: string,
    private readonly prima: string,
    private readonly estado: string,
  ) { }

  static create(
    id: UUID,
    rutTitular: string,
    fechaEmision: string,
    planSalud: string,
    prima: string,
    estado: string
  ) {
    return new Policy(id, rutTitular, fechaEmision, planSalud, prima, estado);
  }
}