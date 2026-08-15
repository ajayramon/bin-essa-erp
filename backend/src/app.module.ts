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
import { ItemVariantsModule } from './item-variants/item-variants.module';
import { AgingReportsModule } from './aging-reports/aging-reports.module';

// New Enterprise Business Modules
import { StockAdjustmentsModule } from './stock-adjustments/stock-adjustments.module';
import { StockCountsModule } from './stock-counts/stock-counts.module';
import { CashManagementModule } from './cash-management/cash-management.module';
import { BankManagementModule } from './bank-management/bank-management.module';
import { CostCentersModule } from './cost-centers/cost-centers.module';
import { ExpensesModule } from './expenses/expenses.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { CommissionsModule } from './commissions/commissions.module';
import { HrPayrollModule } from './hr-payroll/hr-payroll.module';
import { QuotationsModule } from './quotations/quotations.module';
import { DeliveryNotesModule } from './delivery-notes/delivery-notes.module';
import { PurchaseRequisitionsModule } from './purchase-requisitions/purchase-requisitions.module';
import { GoodsReceiptsModule } from './goods-receipts/goods-receipts.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { FinancialReportsModule } from './financial-reports/financial-reports.module';
import { PricingEngineModule } from './pricing-engine/pricing-engine.module';

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
    ItemVariantsModule,
    AgingReportsModule,

    // Enterprise Modules
    StockAdjustmentsModule,
    StockCountsModule,
    CashManagementModule,
    BankManagementModule,
    CostCentersModule,
    ExpensesModule,
    LoyaltyModule,
    CommissionsModule,
    HrPayrollModule,
    QuotationsModule,
    DeliveryNotesModule,
    PurchaseRequisitionsModule,
    GoodsReceiptsModule,
    VouchersModule,
    FinancialReportsModule,
    PricingEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}