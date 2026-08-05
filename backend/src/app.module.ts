import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { CustomersModule } from './customers/customers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { SalesInvoicesModule } from './sales-invoices/sales-invoices.module';
import { AccountsModule } from './accounts/accounts.module';
import { JournalEntriesModule } from './journal-entries/journal-entries.module';
import { TrialBalanceModule } from './trial-balance/trial-balance.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { PurchaseInvoicesModule } from './purchase-invoices/purchase-invoices.module';
import { StockTransfersModule } from './stock-transfers/stock-transfers.module';
import { SalesOrdersModule } from './sales-orders/sales-orders.module';
import { CustomerPaymentsModule } from './customer-payments/customer-payments.module';
import { PromotionsModule } from './promotions/promotions.module';
import { DiscountPermissionsModule } from './discount-permissions/discount-permissions.module';
import { UsersModule } from './users/users.module';
import { PosShiftsModule } from './pos-shifts/pos-shifts.module';
import { PdcChecksModule } from './pdc-checks/pdc-checks.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    CustomersModule,
    SuppliersModule,
    SalesInvoicesModule,
    SalesOrdersModule,
    CustomerPaymentsModule,
    PurchaseOrdersModule,
    PurchaseInvoicesModule,
    StockTransfersModule,
    AccountsModule,
    JournalEntriesModule,
    TrialBalanceModule,
    PromotionsModule,
    DiscountPermissionsModule,
    PosShiftsModule,
    PdcChecksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}