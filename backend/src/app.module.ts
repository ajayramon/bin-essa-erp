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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ItemsModule,
    CustomersModule,
    SuppliersModule,
    SalesInvoicesModule,
    PurchaseOrdersModule,
    AccountsModule,
    JournalEntriesModule,
    TrialBalanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}