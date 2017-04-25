CREATE TABLE [dbo].[WineType] (
    [TypeID]   BIGINT          IDENTITY (1, 1) NOT NULL,
    [TypeName] NVARCHAR (MAX)  NOT NULL,
    [TypeIcon] VARBINARY (MAX) NULL,
    CONSTRAINT [PK_WineType] PRIMARY KEY CLUSTERED ([TypeID] ASC)
);

