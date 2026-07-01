-- AlterTable
ALTER TABLE "Payout" ADD COLUMN "bankName" TEXT,
                     ADD COLUMN "accountName" TEXT,
                     ADD COLUMN "accountNumber" TEXT;

-- AlterTable
ALTER TABLE "Refund" ADD COLUMN "bankName" TEXT,
                     ADD COLUMN "accountName" TEXT,
                     ADD COLUMN "accountNumber" TEXT;
