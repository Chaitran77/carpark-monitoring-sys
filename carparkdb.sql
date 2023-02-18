BEGIN;

CREATE TABLE IF NOT EXISTS public."Account"
(
    "account_id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "username" character varying(20) NOT NULL,
    "password_hash" character varying(256) NOT NULL,
    "role" integer NOT NULL,
    "delete_table" boolean NOT NULL,
    "last_login" timestamp without time zone,
    PRIMARY KEY ("account_id")
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
    "carpark_id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "total_spaces" integer NOT NULL,
    "used_spaces" integer NOT NULL,
    PRIMARY KEY ("carpark_id")
);

CREATE TABLE IF NOT EXISTS public."Camera"
(
    "camera_id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "ip_address" inet NOT NULL DEFAULT '192.168.1.108',
    "event_url" character varying NOT NULL,
    "response_format" character varying NOT NULL,
    "carpark_id" integer NOT NULL,
    PRIMARY KEY ("camera_id")
);

CREATE TABLE IF NOT EXISTS public."Log"
(
    "log_id" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 ),
    "camera_id" integer NOT NULL,
    "numberplate" character varying(7) NOT NULL,
    "vehicle_id" integer,
    "entry_timestamp" timestamp without time zone NOT NULL,
    "exit_timestamp" timestamp without time zone NOT NULL,
    PRIMARY KEY ("log_id")
);

ALTER TABLE IF EXISTS public."Vehicle"
    ADD CONSTRAINT "tenant_id" FOREIGN KEY ("tenant_id")
    REFERENCES public."Tenant" ("tenant_id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Camera"
    ADD CONSTRAINT "carpark_id" FOREIGN KEY ("carpark_id")
    REFERENCES public."Carpark" ("carpark_id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Log"
    ADD CONSTRAINT "camera_id" FOREIGN KEY ("camera_id")
    REFERENCES public."Camera" ("camera_id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public."Log"
    ADD CONSTRAINT "vehicle_id" FOREIGN KEY ("vehicle_id")
    REFERENCES public."Vehicle" ("vehicle_id") MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

ALTER TABLE IF EXISTS public."Log"
	ADD COLUMN "entry_image_base64" character varying(25000),
    ADD COLUMN "exit_image_base64" character varying(25000);

END;
