-- CreateTable
CREATE TABLE "user" (
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");
