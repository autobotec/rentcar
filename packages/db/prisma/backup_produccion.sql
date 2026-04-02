PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('564757be-6656-4d6c-871d-7d48f76f5c46','f6d501dc7b77df661fbad72df296c4cb81ba280b809d03af12d14964be75d0c6',1773699633611,'20260313165539_init',NULL,NULL,1773699633598,1);
INSERT INTO _prisma_migrations VALUES('baab482f-f224-44b3-b9e2-f8928f8a99e8','05563802e4081ff479ac4e9f48209703e19a9c02b09ac719bc3b16ba47b184d9',1773699676044,'20260316222116_add_vehicle_expenses',NULL,NULL,1773699676029,1);
INSERT INTO _prisma_migrations VALUES('4f2f61f0-8b38-4ced-9c6d-dcf70034e11f','8321108211b50733a38192c2f7f71aadb5d0e14c2c5387131210f28acb70f31c',1774657815979,'20260327120000_add_vehicle_public_code',NULL,NULL,1774657815975,1);
INSERT INTO _prisma_migrations VALUES('de1953ae-0803-42ec-a3f1-2ac5a5e33d57','abab801345cdb941b97c1b169b60da60d7e2035436dd9c41334f14c864a3c038',1774738433234,'20260328120000_vehicle_maintenance_history',NULL,NULL,1774738433228,1);
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "language" TEXT NOT NULL DEFAULT 'es',
    "role" TEXT NOT NULL DEFAULT 'customer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO User VALUES('504130c6-3f93-4f30-bff7-eb425870463c','guiguiriosucc@gmail.com',NULL,'SALSA PARA SALSEROS',NULL,NULL,'es','customer',1773710249475,1773953606457);
CREATE TABLE IF NOT EXISTS "Location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Dominican Republic',
    "region" TEXT,
    "address" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Location VALUES('5d97894e-8c4c-4641-8d3c-24737600d3e0','Aeropuerto Internacional de Punta Cana','airport','PUJ','Dominican Republic','Punta Cana',NULL,NULL,NULL,1,1773699893199,1773699893199);
INSERT INTO Location VALUES('cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','Aeropuerto Internacional Las Américas','airport','SDQ','Dominican Republic','Santo Domingo',NULL,NULL,NULL,1,1773699893245,1773699893245);
CREATE TABLE IF NOT EXISTS "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locationId" TEXT,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "transmission" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "doors" INTEGER,
    "airConditioning" BOOLEAN NOT NULL DEFAULT true,
    "luggage" INTEGER,
    "basePricePerDay" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'available',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL, "driveType" TEXT, "engine" TEXT, "publicCode" TEXT,
    CONSTRAINT "Vehicle_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO Vehicle VALUES('86017cfd-711f-43e5-975c-f47cce159efd','5d97894e-8c4c-4641-8d3c-24737600d3e0','JEEP','WRANGLER UNLIMITED',2022,'automatic','gasoline',5,4,1,2,45.0,'USD','available','Es el balance perfecto entre aventura extrema y comodidad. A diferencia del modelo clásico, esta versión de 4 puertas ofrece un espacio interior generoso para 5 pasajeros y un maletero real para equipaje, sin sacrificar la esencia todoterreno de Jeep.',1773699893249,1774657835709,'4x4','3.0L','JEEP-WRANGLER-UNLIMITED-825496');
INSERT INTO Vehicle VALUES('ef33e76c-14d1-4f5f-9780-9234747b112d','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','PORSCHE','CAYENNE',2023,'automatic','gasoline',5,4,1,3,75.0,'USD','available',replace('Porsche Cayenne S (V8 Edition)\nLa Porsche Cayenne S redefine lo que debe ser una SUV de lujo, combinando el ADN de un coche deportivo con la versatilidad de un vehículo familiar. Es la opción definitiva para quienes no están dispuestos a sacrificar potencia por espacio.','\n',char(10)),1773699893253,1774657835717,'4x4','4.0L','PORSCHE-CAYENNE-591895');
INSERT INTO Vehicle VALUES('0be8a450-42b7-4706-b6c1-ceb28036095e','5d97894e-8c4c-4641-8d3c-24737600d3e0','BMW','X5',2024,'automatic','gasoline',5,4,1,2,80.0,'USD','available',replace('BMW X5 xDrive40i (Generación G05)\nLa BMW X5 es la combinación perfecta de deportividad, lujo y tecnología de vanguardia. Es ampliamente considerada como la SUV que mejor se conduce en su categoría, ofreciendo una agilidad sorprendente para su tamaño.','\n',char(10)),1773699893300,1774657835731,'4x4','3.0L','BMW-X5-703299');
INSERT INTO Vehicle VALUES('99de4b4f-e350-4c65-8cd4-69ace2f4db1a','5d97894e-8c4c-4641-8d3c-24737600d3e0','HONDA','CR-V',2020,'automatic','gasoline',5,4,1,1,75.0,'USD','available','Se trata de una Honda CR-V, es muy eficiente para su tamaño, logrando un promedio de 12-14 km/l en uso mixto, Es considerada la reina de su segmento en cuanto a capacidad de carga en el baúl y espacio para las piernas en la segunda fila.',1773706204272,1774657835736,NULL,'2.0L','HONDA-CR-V-896890');
INSERT INTO Vehicle VALUES('807f109e-5708-4755-a5b7-551f73d66cdb','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','FORD','EXPLORER',2018,'automatic','gasoline',5,4,1,1,80.0,'USD','available','La Ford Explorer 2018 es un referente en el segmento de las SUVs medianas, especialmente valorada por las familias que necesitan espacio y potencia.',1773706316938,1774657835741,'4x4','3.5L','FORD-EXPLORER-831946');
INSERT INTO Vehicle VALUES('f241a8a2-7d70-48b5-bd66-5e277e63b478','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','CHEVROLET','SILVERADO',2020,'automatic','gasoline',5,4,1,1,80.0,'USD','available','Esta Chevrolet Silverado (generación 2020) es una de las camionetas de tamaño completo (full-size) más imponentes y capaces.',1773706492973,1774657835745,NULL,'3.5L','CHEVROLET-SILVERADO-638594');
INSERT INTO Vehicle VALUES('ba7dc49c-98cc-4d88-acbd-096bdeb2b190','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','HYUNDAI','SONATA',2019,'automatic','gasoline',5,4,1,1,55.0,'USD','available','Específicamente, parece ser un modelo de la séptima generación (LF) Se trata de un sedán de tamaño mediano conocido por su diseño elegante y su interior espacioso.',1773706664461,1774657835752,NULL,'2.0L','HYUNDAI-SONATA-484789');
INSERT INTO Vehicle VALUES('ec08b554-b3ac-4b15-b3e1-bcae988763d8','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','KIA','OPTIMA',2020,'automatic','gasoline',5,4,1,1,55.0,'USD','available','El Kia Optima es un sedán mediano que combina un diseño deportivo con un interior sorprendentemente espacioso y tecnológico. Es el vehículo perfecto para quienes buscan elegancia y confort sin las complicaciones de una SUV.',1773706874549,1774657835757,NULL,NULL,'KIA-OPTIMA-304806');
INSERT INTO Vehicle VALUES('a5f85bc6-41da-42a6-93ca-ca4b08fb0d86','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','HYUNDAI','CRETA',2019,'automatic','gasoline',5,4,1,1,55.0,'USD','available','La Hyundai Tucson es una de las SUVs más equilibradas y exitosas del mercado por su confiabilidad y diseño fluido.',1773707236707,1774657835761,'4x2','2.0L','HYUNDAI-CRETA-981558');
INSERT INTO Vehicle VALUES('dcde3522-9139-41e4-b6b4-52a66701b628','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','FORD','ESCAPE',2020,'automatic','gasoline',5,4,1,1,55.0,'USD','available','SUV compacta color gris oscuro de Ford, con diseño moderno, buena altura al suelo y capacidad para 5 pasajeros. Ideal para uso urbano y viajes, ofreciendo comodidad, espacio y eficiencia.',1773888469052,1774657835766,'4x2','2.0L','FORD-ESCAPE-997597');
INSERT INTO Vehicle VALUES('c0c9eded-4132-44c7-b7b4-6c46644c316d','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','FORD','ESCAPE',2022,'automatic','gasoline',5,4,1,1,59.97999999999999688,'USD','available','La Ford Escape 2020 es una SUV compacta que equilibra perfectamente la tecnología moderna con un manejo ágil. Es ideal tanto para la ciudad como para viajes por carretera gracias a su suspensión firme y dirección precisa.',1774127368380,1774657835771,'4x2','2.0L','FORD-ESCAPE-735956');
CREATE TABLE IF NOT EXISTS "VehicleImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO VehicleImage VALUES('ffefbe57-c063-49b5-902b-b10e991ea99e','0be8a450-42b7-4706-b6c1-ceb28036095e','http://localhost:3000/uploads/1773705705461-sscebl15c39.png',1,0);
INSERT INTO VehicleImage VALUES('3a58fc56-b1f4-4625-b8fb-43e4f707e68d','ef33e76c-14d1-4f5f-9780-9234747b112d','http://localhost:3000/uploads/1773705906366-gq6tl31645r.png',1,0);
INSERT INTO VehicleImage VALUES('f977d809-766c-47dc-b824-898a4232354b','86017cfd-711f-43e5-975c-f47cce159efd','http://localhost:3000/uploads/1773706009739-oshwzw6s06b.png',1,0);
INSERT INTO VehicleImage VALUES('96a8c221-1c8a-44b3-a582-95ae7390683f','99de4b4f-e350-4c65-8cd4-69ace2f4db1a','http://localhost:3000/uploads/1773706204297-qfphfph9zwa.jpeg',1,0);
INSERT INTO VehicleImage VALUES('40bb9fd2-0a6a-470b-bb5d-53c83842bf4d','f241a8a2-7d70-48b5-bd66-5e277e63b478','http://localhost:3000/uploads/1773706493012-z8gazuxq5t.png',1,0);
INSERT INTO VehicleImage VALUES('8e319188-9018-48a4-bda0-c16ea64f7064','ba7dc49c-98cc-4d88-acbd-096bdeb2b190','http://localhost:3000/uploads/1773706664511-hd2tt21a62b.jpeg',1,0);
INSERT INTO VehicleImage VALUES('42e1f737-5ab3-47c2-aa85-6006a42ad94c','ec08b554-b3ac-4b15-b3e1-bcae988763d8','http://localhost:3000/uploads/1773706874594-kjo27jxr7o9.jpeg',1,0);
INSERT INTO VehicleImage VALUES('e7fe5b38-ce8b-4864-a002-98a11ee9739a','a5f85bc6-41da-42a6-93ca-ca4b08fb0d86','http://localhost:3000/uploads/1773707236745-fext2o33xl8.png',1,0);
INSERT INTO VehicleImage VALUES('8ae0997d-0aff-419e-9797-cdcf58d0ea45','807f109e-5708-4755-a5b7-551f73d66cdb','http://localhost:3000/uploads/1773710015552-8sfdoj5rzr.png',1,0);
INSERT INTO VehicleImage VALUES('7754d066-be5b-412d-8dd4-b709a4c33904','dcde3522-9139-41e4-b6b4-52a66701b628','http://localhost:3000/uploads/1773888470546-tdlqzy5zizf.jpeg',1,0);
INSERT INTO VehicleImage VALUES('248f4008-e50f-481b-9632-ec04ae69ef99','c0c9eded-4132-44c7-b7b4-6c46644c316d','http://localhost:3000/uploads/1774127369286-hxpx3v0ba1t.png',1,0);
CREATE TABLE IF NOT EXISTS "Season" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "locationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Season_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Price" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "seasonId" TEXT,
    "dailyPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "minDays" INTEGER NOT NULL DEFAULT 1,
    "maxDays" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Price_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Price_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Extra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pricePerDay" REAL,
    "priceType" TEXT NOT NULL DEFAULT 'per_day',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO Extra VALUES('cae23016-10bd-4bd3-9a71-2d69fa705332','GPS','Navegador GPS',5.0,'per_day','USD',1);
INSERT INTO Extra VALUES('66e0b424-418a-4b7d-b729-a6501ecf59b4','Silla de bebé','Silla infantil',8.0,'per_day','USD',1);
INSERT INTO Extra VALUES('aba451ae-6afc-4344-bc0f-29f47a1a9259','Conductor adicional','Segundo conductor autorizado',15.0,'per_day','USD',1);
CREATE TABLE IF NOT EXISTS "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "pickupLocationId" TEXT NOT NULL,
    "dropoffLocationId" TEXT NOT NULL,
    "pickupDatetime" DATETIME NOT NULL,
    "dropoffDatetime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalPrice" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentMode" TEXT NOT NULL DEFAULT 'full',
    "reservationNumber" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL, "checkinAt" DATETIME, "checkoutAt" DATETIME,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_dropoffLocationId_fkey" FOREIGN KEY ("dropoffLocationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Reservation VALUES('0150f2dd-1c61-4943-8974-fa680d1ebf73','504130c6-3f93-4f30-bff7-eb425870463c','ec08b554-b3ac-4b15-b3e1-bcae988763d8','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1773710220000,1773969420000,'canceled',165.0,'USD','pending','full','RC-TXABK5',1773710249478,1773710597824,NULL,NULL);
INSERT INTO Reservation VALUES('86faa4df-0814-4a40-8aad-ec377c87c88f','504130c6-3f93-4f30-bff7-eb425870463c','ba7dc49c-98cc-4d88-acbd-096bdeb2b190','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1773797460000,1774143060000,'completed',220.0,'USD','pending','full','RC-TYA2B0',1773711917101,1773712184512,1773712183039,1773712184511);
INSERT INTO Reservation VALUES('dc2fbfd2-bd9f-42fa-a314-67824b26f73b','504130c6-3f93-4f30-bff7-eb425870463c','ef33e76c-14d1-4f5f-9780-9234747b112d','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1773712200000,1774230600000,'confirmed',588.0,'USD','paid','full','RC-TYHNK3',1773712271236,1773712280071,NULL,NULL);
INSERT INTO Reservation VALUES('05120369-4a8a-4958-86f8-6dc33712cd03','504130c6-3f93-4f30-bff7-eb425870463c','807f109e-5708-4755-a5b7-551f73d66cdb','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1773844560000,1774190160000,'confirmed',320.0,'USD','paid','full','RC-W5ANK5',1773844634310,1773844730676,NULL,NULL);
INSERT INTO Reservation VALUES('22415297-93b4-4a69-87ed-ce104f50c97e','504130c6-3f93-4f30-bff7-eb425870463c','ef33e76c-14d1-4f5f-9780-9234747b112d','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1774972380000,1775404380000,'pending',375.0,'USD','pending','full','RC-W81CMI',1773849239083,1773849239083,NULL,NULL);
INSERT INTO Reservation VALUES('78e13a1c-d7be-46a6-98c7-41a9f2b3a692','504130c6-3f93-4f30-bff7-eb425870463c','ef33e76c-14d1-4f5f-9780-9234747b112d','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1774972380000,1775404380000,'confirmed',375.0,'USD','paid','full','RC-W84ZOM',1773849408935,1773849420998,NULL,NULL);
INSERT INTO Reservation VALUES('2622fdf4-1cd3-468f-a959-8f4c5afffb3e','504130c6-3f93-4f30-bff7-eb425870463c','ba7dc49c-98cc-4d88-acbd-096bdeb2b190','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1773849540000,1774195200000,'confirmed',275.0,'USD','paid','full','RC-W8A9LD',1773849655058,1773854653925,NULL,NULL);
INSERT INTO Reservation VALUES('ae1693f5-4934-4ec2-8d62-2ed7a2030a87','504130c6-3f93-4f30-bff7-eb425870463c','dcde3522-9139-41e4-b6b4-52a66701b628','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1773953460000,1774299060000,'confirmed',252.0,'USD','paid','full','RC-XY4AUS',1773953512949,1773953567746,NULL,NULL);
INSERT INTO Reservation VALUES('688db272-8dfc-4875-91ef-d9fad033f895','504130c6-3f93-4f30-bff7-eb425870463c','a5f85bc6-41da-42a6-93ca-ca4b08fb0d86','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28','cf076613-fb1c-49e1-83fb-cfb4dfc4ba28',1774039980000,1774385580000,'pending',220.0,'USD','pending','full','RC-XY6B0B',1773953606459,1773953606459,NULL,NULL);
CREATE TABLE IF NOT EXISTS "ReservationExtra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "extraId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    CONSTRAINT "ReservationExtra_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReservationExtra_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO ReservationExtra VALUES('7976ba80-c5d3-4b59-9537-574c6401b4b2','dc2fbfd2-bd9f-42fa-a314-67824b26f73b','aba451ae-6afc-4344-bc0f-29f47a1a9259',1,90.0,'USD');
INSERT INTO ReservationExtra VALUES('8e7a6c37-5c92-4350-8027-b9ae6827b74e','dc2fbfd2-bd9f-42fa-a314-67824b26f73b','66e0b424-418a-4b7d-b729-a6501ecf59b4',1,48.0,'USD');
INSERT INTO ReservationExtra VALUES('fb020018-941b-4b9b-8a50-f094b97db462','ae1693f5-4934-4ec2-8d62-2ed7a2030a87','66e0b424-418a-4b7d-b729-a6501ecf59b4',1,32.0,'USD');
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerPaymentId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Payment VALUES('b399188a-275c-4d8d-b485-7f6832df568a','86faa4df-0814-4a40-8aad-ec377c87c88f','test','test_mmtya2bk',55.0,'USD','pending','full',1773711917121,1773711917121);
INSERT INTO Payment VALUES('6056b541-aa4f-4cc4-9893-cf5eebd8544f','dc2fbfd2-bd9f-42fa-a314-67824b26f73b','test','test_mmtyhnki',75.0,'USD','succeeded','full',1773712271251,1773712280068);
INSERT INTO Payment VALUES('82019041-e3c6-4c6c-a84b-455ddfb737e7','05120369-4a8a-4958-86f8-6dc33712cd03','stripe','test_mmw5anke',80.0,'USD','succeeded','full',1773844634319,1773844730659);
INSERT INTO Payment VALUES('979d9b2a-a663-49e8-b84a-15087baec516','22415297-93b4-4a69-87ed-ce104f50c97e','stripe','test_mmw81cms',75.0,'USD','pending','full',1773849239093,1773849239093);
INSERT INTO Payment VALUES('7fac45c7-eeba-4390-82c5-77b60cc88fa5','78e13a1c-d7be-46a6-98c7-41a9f2b3a692','stripe','test_mmw84zow',75.0,'USD','succeeded','full',1773849408946,1773849420996);
INSERT INTO Payment VALUES('b477ee7e-cdd2-4667-be85-8d63534d79b6','2622fdf4-1cd3-468f-a959-8f4c5afffb3e','stripe','test_mmw8a9lq',55.0,'USD','pending','full',1773849655071,1773849655071);
INSERT INTO Payment VALUES('b8061bf2-2237-4804-bae4-4ced7dfc328b','2622fdf4-1cd3-468f-a959-8f4c5afffb3e','stripe','pi_3TCNkCDvHHd05rhn0RnqVHAY',55.0,'USD','pending','deposit',1773854336669,1773854336669);
INSERT INTO Payment VALUES('de5b31d6-4cfc-45c5-80dc-c33b3d353e57','2622fdf4-1cd3-468f-a959-8f4c5afffb3e','paypal','1F820175DB060960U',55.0,'USD','pending','deposit',1773854365577,1773854365577);
INSERT INTO Payment VALUES('f070e3a3-b6dc-4d71-acb9-0180db9daa39','2622fdf4-1cd3-468f-a959-8f4c5afffb3e','stripe','pi_3TCNkqDvHHd05rhn2I1z2gxg',55.0,'USD','succeeded','deposit',1773854376334,1773854653922);
INSERT INTO Payment VALUES('475a4ac0-8d5b-4f10-a6fc-7cace5cf83ae','ae1693f5-4934-4ec2-8d62-2ed7a2030a87','stripe','pi_3TCnXpDvHHd05rhn0WuUKPqR',55.0,'USD','succeeded','deposit',1773953513911,1773953567740);
INSERT INTO Payment VALUES('a2e42b11-83b9-4fe6-9042-441c9b9ee010','688db272-8dfc-4875-91ef-d9fad033f895','paypal','3V518908W2343811N',55.0,'USD','pending','deposit',1773953607973,1773953607973);
CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reservationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "SeoPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "h1" TEXT NOT NULL,
    "metaDescription" TEXT,
    "contentHtml" TEXT,
    "type" TEXT NOT NULL,
    "locationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SeoPage_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "VehicleTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VehicleTranslation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO VehicleTranslation VALUES('786f8ea9-6868-4c33-bd46-0af9f6d7e105','807f109e-5708-4755-a5b7-551f73d66cdb','es','FORD','EXPLORER','La Ford Explorer 2018 es un referente en el segmento de las SUVs medianas, especialmente valorada por las familias que necesitan espacio y potencia.',1773710020042,1773710020042);
INSERT INTO VehicleTranslation VALUES('f40508e3-71c7-4cd6-b2b8-61598d9fb8bd','807f109e-5708-4755-a5b7-551f73d66cdb','en','FORD','EXPLORER','La Ford Explorer 2018 es un referente en el segmento de las SUVs medianas, especialmente valorada por las familias que necesitan espacio y potencia.',1773710020048,1773710020048);
INSERT INTO VehicleTranslation VALUES('4ee6e51f-3ae7-41e0-8410-efcfbf478ec7','807f109e-5708-4755-a5b7-551f73d66cdb','fr','FORD','EXPLORER','La Ford Explorer 2018 es un referente en el segmento de las SUVs medianas, especialmente valorada por las familias que necesitan espacio y potencia.',1773710020050,1773710020050);
INSERT INTO VehicleTranslation VALUES('5fabf0c7-1fca-4009-b0b8-1207274dcb40','dcde3522-9139-41e4-b6b4-52a66701b628','es','FORD','ESCAPE','SUV compacta color gris oscuro de Ford, con diseño moderno, buena altura al suelo y capacidad para 5 pasajeros. Ideal para uso urbano y viajes, ofreciendo comodidad, espacio y eficiencia.',1773888470007,1773888470007);
INSERT INTO VehicleTranslation VALUES('5bac67e8-92bd-4625-80fc-ddfbd8bc4048','dcde3522-9139-41e4-b6b4-52a66701b628','en','FORD','ESCAPE','SUV compacta color gris oscuro de Ford, con diseño moderno, buena altura al suelo y capacidad para 5 pasajeros. Ideal para uso urbano y viajes, ofreciendo comodidad, espacio y eficiencia.',1773888470010,1773888470010);
INSERT INTO VehicleTranslation VALUES('7c48418c-e58f-47dd-8ff3-d66e14476930','dcde3522-9139-41e4-b6b4-52a66701b628','fr','FORD','ESCAPE','SUV compacta color gris oscuro de Ford, con diseño moderno, buena altura al suelo y capacidad para 5 pasajeros. Ideal para uso urbano y viajes, ofreciendo comodidad, espacio y eficiencia.',1773888470015,1773888470015);
INSERT INTO VehicleTranslation VALUES('4c33c16c-804c-4f97-bdc4-97d281c1f721','c0c9eded-4132-44c7-b7b4-6c46644c316d','es','FORD','ESCAPE','La Ford Escape 2020 es una SUV compacta que equilibra perfectamente la tecnología moderna con un manejo ágil. Es ideal tanto para la ciudad como para viajes por carretera gracias a su suspensión firme y dirección precisa.',1774127369015,1774127369015);
INSERT INTO VehicleTranslation VALUES('087338c0-1ffb-435b-a99c-c635910d1481','c0c9eded-4132-44c7-b7b4-6c46644c316d','en','FORD','ESCAPE','La Ford Escape 2020 es una SUV compacta que equilibra perfectamente la tecnología moderna con un manejo ágil. Es ideal tanto para la ciudad como para viajes por carretera gracias a su suspensión firme y dirección precisa.',1774127369024,1774127369024);
INSERT INTO VehicleTranslation VALUES('3e3ad61a-e637-4383-8bbb-3115b3169504','c0c9eded-4132-44c7-b7b4-6c46644c316d','fr','FORD','ESCAPE','La Ford Escape 2020 es una SUV compacta que equilibra perfectamente la tecnología moderna con un manejo ágil. Es ideal tanto para la ciudad como para viajes por carretera gracias a su suspensión firme y dirección precisa.',1774127369027,1774127369027);
CREATE TABLE IF NOT EXISTS "VehicleMaintenanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "performedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mileageKm" INTEGER,
    "category" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "amount" REAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VehicleMaintenanceRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Reservation_reservationNumber_key" ON "Reservation"("reservationNumber");
CREATE UNIQUE INDEX "Review_reservationId_key" ON "Review"("reservationId");
CREATE UNIQUE INDEX "SeoPage_slug_key" ON "SeoPage"("slug");
CREATE UNIQUE INDEX "Location_code_key" ON "Location"("code");
CREATE UNIQUE INDEX "VehicleTranslation_vehicleId_locale_key" ON "VehicleTranslation"("vehicleId", "locale");
CREATE UNIQUE INDEX "Vehicle_publicCode_key" ON "Vehicle"("publicCode");
CREATE INDEX "VehicleMaintenanceRecord_vehicleId_idx" ON "VehicleMaintenanceRecord"("vehicleId");
CREATE INDEX "VehicleMaintenanceRecord_performedAt_idx" ON "VehicleMaintenanceRecord"("performedAt");
COMMIT;
