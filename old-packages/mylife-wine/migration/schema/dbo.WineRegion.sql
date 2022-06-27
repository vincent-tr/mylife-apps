CREATE TABLE [dbo].[WineRegion] (
    [RegionID]   BIGINT          IDENTITY (1, 1) NOT NULL,
    [RegionName] VARCHAR (MAX)   NOT NULL,
    [RegionIcon] VARBINARY (MAX) NULL,
    CONSTRAINT [PK_WineRegion] PRIMARY KEY CLUSTERED ([RegionID] ASC)
);

