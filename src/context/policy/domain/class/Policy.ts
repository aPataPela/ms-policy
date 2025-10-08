import { UUID } from 'node:crypto';

type PolicyStatus = "emitida" | "activa" | "anulada";
export class Policy {
  constructor(
    private readonly id: UUID,
    private readonly rutTitular: string,
    private readonly fechaEmision: Date,
    private readonly planSalud: string,
    private readonly prima: number,
    private readonly estado: PolicyStatus,
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