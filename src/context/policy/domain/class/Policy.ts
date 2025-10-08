import { UUID } from 'node:crypto';

type PolicyStatus = "emitida" | "activa" | "anulada";
export class Policy {
  constructor(
    readonly id: UUID,
    readonly rutTitular: string,
    readonly fechaEmision: Date,
    readonly planSalud: string,
    readonly prima: number,
    readonly estado: PolicyStatus,
  ) { }

  static create(
    id: UUID,
    rutTitular: string,
    fechaEmision: Date,
    planSalud: string,
    prima: number,
    estado: PolicyStatus
  ) {
    return new Policy(id, rutTitular, fechaEmision, planSalud, prima, estado);
  }
}