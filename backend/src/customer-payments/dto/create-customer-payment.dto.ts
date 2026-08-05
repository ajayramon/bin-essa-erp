import { PaymentMethod } from '../../../generated/prisma/client';

export class CreateCustomerPaymentDto {
  receiptNumber!: string;
  customerId!: string;
  branchId?: string;
  amount!: number;
  paymentMethod!: PaymentMethod;
  reference?: string;
  notes?: string;
}
