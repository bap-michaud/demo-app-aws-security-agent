[dotenv@17.2.3] injecting env (10) from .env.local -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "quoteText" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorBiography" TEXT,
    "historicalContext" TEXT,
    "source" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "cognitoUserId" TEXT NOT NULL,
    "citationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CitationRelation" (
    "id" TEXT NOT NULL,
    "fromCitationId" TEXT NOT NULL,
    "toCitationId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,

    CONSTRAINT "CitationRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_cognitoUserId_idx" ON "Favorite"("cognitoUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_cognitoUserId_citationId_key" ON "Favorite"("cognitoUserId", "citationId");

-- CreateIndex
CREATE UNIQUE INDEX "CitationRelation_fromCitationId_toCitationId_relationType_key" ON "CitationRelation"("fromCitationId", "toCitationId", "relationType");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_citationId_fkey" FOREIGN KEY ("citationId") REFERENCES "Citation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitationRelation" ADD CONSTRAINT "CitationRelation_fromCitationId_fkey" FOREIGN KEY ("fromCitationId") REFERENCES "Citation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CitationRelation" ADD CONSTRAINT "CitationRelation_toCitationId_fkey" FOREIGN KEY ("toCitationId") REFERENCES "Citation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

