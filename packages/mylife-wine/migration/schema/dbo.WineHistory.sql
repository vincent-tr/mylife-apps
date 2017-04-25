CREATE TABLE [dbo].[WineHistory] (
    [HistoryID]               BIGINT     IDENTITY (1, 1) NOT NULL,
    [HistoryArticleID]        BIGINT     NOT NULL,
    [HistoryYear]             INT        NOT NULL,
    [HistoryBottleCount]      INT        NOT NULL,
    [HistoryBottleCapacityID] BIGINT     NOT NULL,
    [HistoryDate]             DATETIME   NOT NULL,
    [HistoryIsAdd]            BIT        NOT NULL,
    [HistoryBottlePrice]      FLOAT (53) NULL,
    [HistoryNote]             TEXT       NULL,
    CONSTRAINT [PK_WineHistory] PRIMARY KEY CLUSTERED ([HistoryID] ASC),
    CONSTRAINT [FK_WineHistory_WineArticle] FOREIGN KEY ([HistoryArticleID]) REFERENCES [dbo].[WineArticle] ([ArticleID]),
    CONSTRAINT [FK_WineHistory_WineBottleCapacity] FOREIGN KEY ([HistoryBottleCapacityID]) REFERENCES [dbo].[WineBottleCapacity] ([BottleCapacityID])
);

