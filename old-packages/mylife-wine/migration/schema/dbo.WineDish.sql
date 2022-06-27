CREATE TABLE [dbo].[WineDish] (
    [DishID]   BIGINT          IDENTITY (1, 1) NOT NULL,
    [DishName] NVARCHAR (MAX)  NOT NULL,
    [DishIcon] VARBINARY (MAX) NULL,
    CONSTRAINT [PK_WineDish] PRIMARY KEY CLUSTERED ([DishID] ASC)
);

