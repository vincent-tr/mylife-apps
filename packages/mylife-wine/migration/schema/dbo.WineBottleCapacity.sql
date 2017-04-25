CREATE TABLE [dbo].[WineBottleCapacity] (
    [BottleCapacityID]    BIGINT          IDENTITY (1, 1) NOT NULL,
    [BottleCapacityName]  NVARCHAR (MAX)  NOT NULL,
    [BottleCapacityValue] FLOAT (53)      NOT NULL,
    [BottleCapacityIcon]  VARBINARY (MAX) NULL,
    CONSTRAINT [PK_WineCapacity] PRIMARY KEY CLUSTERED ([BottleCapacityID] ASC)
);

