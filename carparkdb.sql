-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;

CREATE TABLE IF NOT EXISTS public."Account"
(
    "AccountID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "Username" character varying(20) NOT NULL,
    "PasswordHash" character varying(256) NOT NULL,
    "Role" integer NOT NULL,
    "Deletable" boolean NOT NULL,
    "LastLogin" timestamp without time zone,
    PRIMARY KEY ("AccountID")
);

CREATE TABLE IF NOT EXISTS public."Vehicle"
(
    "VehicleID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    numberplate character(7) COLLATE pg_catalog."default" NOT NULL,
    "TenantID" integer NOT NULL,
    CONSTRAINT vehicle_pkey PRIMARY KEY ("VehicleID")
);

CREATE TABLE IF NOT EXISTS public."Tenant"
(
    "TenantID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "Forename" character varying(15) NOT NULL,
    "Surname" character varying(15) NOT NULL,
    PRIMARY KEY ("TenantID")
);

CREATE TABLE IF NOT EXISTS public."Carpark"
(
    "CarparkID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "TotalSpaces" integer NOT NULL,
    "UsedSpaces" integer NOT NULL,
    PRIMARY KEY ("CarparkID")
);

CREATE TABLE IF NOT EXISTS public."Camera"
(
    "CameraID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "IPAddress" inet NOT NULL DEFAULT '192.168.1.108',
    "EventURL" character varying NOT NULL,
    "ResponseFormat" character varying NOT NULL,
    "CarparkID" integer NOT NULL,
    PRIMARY KEY ("CameraID")
);

CREATE TABLE IF NOT EXISTS public."Log"
(
    "LogID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "CameraID" integer NOT NULL,
    "Numberplate" character varying(7) NOT NULL,
    "VehicleID" integer,
    "EntryTimestamp" timestamp without time zone NOT NULL,
    "ExitTimestamp" timestamp without time zone NOT NULL,
    PRIMARY KEY ("LogID")
);

ALTER TABLE IF EXISTS public."Vehicle"
    ADD CONSTRAINT "TenantID" FOREIGN KEY ("TenantID")
    REFERENCES public."Tenant" ("TenantID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Camera"
    ADD CONSTRAINT "CarparkID" FOREIGN KEY ("CarparkID")
    REFERENCES public."Carpark" ("CarparkID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Log"
    ADD CONSTRAINT "CameraID" FOREIGN KEY ("CameraID")
    REFERENCES public."Camera" ("CameraID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Log"
    ADD CONSTRAINT "VehicleID" FOREIGN KEY ("VehicleID")
    REFERENCES public."Vehicle" ("VehicleID") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public."Log"
	ADD COLUMN "EntryImageBase64" character varying(25000),
    ADD COLUMN "ExitImageBase64" character varying(25000);

END;