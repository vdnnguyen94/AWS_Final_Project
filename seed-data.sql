---------------------------------------------------------
-- 1. Create Database (Skip if exists)
---------------------------------------------------------
IF NOT EXISTS (
    SELECT name FROM sys.databases WHERE name = N'RescueLinkDb'
)
BEGIN
    CREATE DATABASE RescueLinkDb;
END;
GO

USE RescueLinkDb;
GO


---------------------------------------------------------
-- 2. DROP TABLES IN SAFE ORDER (Child → Parent)
---------------------------------------------------------
IF OBJECT_ID('dbo.Media', 'U') IS NOT NULL
    DROP TABLE dbo.Media;
GO

IF OBJECT_ID('dbo.Incidents', 'U') IS NOT NULL
    DROP TABLE dbo.Incidents;
GO

IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
    DROP TABLE dbo.Users;
GO


---------------------------------------------------------
-- 3. USERS TABLE
---------------------------------------------------------
CREATE TABLE dbo.Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Role NVARCHAR(50) NOT NULL
);
GO

-- Seed Data (10 rows)
INSERT INTO dbo.Users (Name, Email, Role) VALUES
(N'Jane Doe',        'jane.doe@email.com',         N'Responder'),
(N'John Smith',      'john.smith@email.com',       N'Responder'),
(N'Ali Khan',        'ali.khan@email.com',         N'Responder'),
(N'Maria Garcia',    'maria.garcia@email.com',     N'Responder'),
(N'Lee Minji',       'minji.lee@email.com',        N'Responder'),
(N'Noah Wilson',     'noah.wilson@email.com',      N'Responder'),
(N'Chloe Kim',       'chloe.kim@email.com',        N'Admin'),
(N'Sarah Johnson',   'sarah.johnson@email.com',    N'Admin'),
(N'David Wong',      'david.wong@email.com',       N'Dispatcher'),
(N'Emma Brown',      'emma.brown@email.com',       N'Dispatcher');
GO


---------------------------------------------------------
-- 4. INCIDENTS TABLE
---------------------------------------------------------
CREATE TABLE dbo.Incidents (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Latitude FLOAT NOT NULL,
    Longitude FLOAT NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- Seed Data (10 rows)
INSERT INTO dbo.Incidents (Title, Description, Latitude, Longitude, Status)
VALUES
('Flood near River Park',  'Roads blocked, people trapped.',               43.70, -79.40, 'Open'),
('Fire at Main Street',    'Wildfire spreading near houses.',              43.71, -79.45, 'InProgress'),
('Highway Accident',       'Multi-car collision with injuries.',           43.69, -79.50, 'Open'),
('Power Outage',           'Entire block without power.',                  43.68, -79.41, 'Resolved'),
('Bridge Damage',          'Bridge unstable after storm.',                 43.70, -79.38, 'Open'),
('Gas Leak',               'Strong smell reported by residents.',          43.72, -79.46, 'InProgress'),
('Missing Person',         'Last seen near the river.',                    43.69, -79.39, 'Open'),
('Road Collapse',          'Sinkhole on main highway.',                    43.67, -79.42, 'Open'),
('Chemical Spill',         'Hazmat team deployed.',                        43.66, -79.47, 'Resolved'),
('Building Collapse',      'Old building collapsed unexpectedly.',         43.71, -79.43, 'Open');
GO


---------------------------------------------------------
-- 5. MEDIA TABLE
---------------------------------------------------------
CREATE TABLE dbo.Media (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    IncidentId INT NOT NULL,
    Url NVARCHAR(500) NOT NULL,
    Description NVARCHAR(500),
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT FK_Media_Incident 
        FOREIGN KEY (IncidentId) REFERENCES dbo.Incidents(Id)
        ON DELETE CASCADE
);
GO

-- Seed Data (10 rows)
INSERT INTO dbo.Media (IncidentId, Url, Description)
VALUES
(1, 'https://rescuelink-media.s3.amazonaws.com/flood/flood_area_1.jpg',         'Flood area - bridge submerged'),
(1, 'https://rescuelink-media.s3.amazonaws.com/flood/flood_rescue_1.jpg',       'Rescue team preparing boats'),
(2, 'https://rescuelink-media.s3.amazonaws.com/fire/main_street_fire.jpg',      'Smoke rising from Main Street'),
(3, 'https://rescuelink-media.s3.amazonaws.com/accident/highway_collision.jpg', 'Highway collision scene'),
(4, 'https://rescuelink-media.s3.amazonaws.com/outage/transformer_damage.jpg',  'Transformer damage near block'),
(5, 'https://rescuelink-media.s3.amazonaws.com/bridge/bridge_crack.jpg',        'Bridge structural crack'),
(6, 'https://rescuelink-media.s3.amazonaws.com/gas/gas_leak_team.jpg',          'Gas leak detection crew'),
(7, 'https://rescuelink-media.s3.amazonaws.com/missing/search_area_map.jpg',    'Search area overview'),
(8, 'https://rescuelink-media.s3.amazonaws.com/road/sinkhole_closeup.jpg',      'Sinkhole close-up photo'),
(9, 'https://rescuelink-media.s3.amazonaws.com/chemical/hazmat_setup.jpg',      'Hazmat response team setup');
GO


---------------------------------------------------------
-- 6. Verification Queries
---------------------------------------------------------
SELECT 'Users' AS TableName, COUNT(*) AS TotalRows FROM dbo.Users;
SELECT 'Incidents' AS TableName, COUNT(*) AS TotalRows FROM dbo.Incidents;
SELECT 'Media' AS TableName, COUNT(*) AS TotalRows FROM dbo.Media;
GO