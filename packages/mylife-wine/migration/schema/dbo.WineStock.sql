CREATE TABLE [dbo].[WineStock] (
    [StockID]               BIGINT IDENTITY (1, 1) NOT NULL,
    [StockArticleID]        BIGINT NOT NULL,
    [StockYear]             INT    NOT NULL,
    [StockBottleCount]      INT    NOT NULL,
    [StockBottleCapacityID] BIGINT NOT NULL,
    CONSTRAINT [PK_WineStock] PRIMARY KEY CLUSTERED ([StockID] ASC),
    CONSTRAINT [FK_WineStock_WineArticle] FOREIGN KEY ([StockArticleID]) REFERENCES [dbo].[WineArticle] ([ArticleID]),
    CONSTRAINT [FK_WineStock_WineBottleCapacity] FOREIGN KEY ([StockBottleCapacityID]) REFERENCES [dbo].[WineBottleCapacity] ([BottleCapacityID])
);

