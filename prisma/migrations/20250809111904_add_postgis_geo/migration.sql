CREATE INDEX IF NOT EXISTS property_isdeleted_status_createdat
  ON "property" ("isDeleted", "status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS property_latitude ON "property" ("latitude");
CREATE INDEX IF NOT EXISTS property_longitude ON "property" ("longitude");
CREATE INDEX IF NOT EXISTS property_price ON "property" ("price");
CREATE INDEX IF NOT EXISTS property_bedrooms ON "property" ("bedrooms");
