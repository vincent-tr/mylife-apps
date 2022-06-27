CREATE TABLE [dbo].[WineArticleDish] (
    [ArticleID] BIGINT NOT NULL,
    [DishID]    BIGINT NOT NULL,
    CONSTRAINT [PK_WineArticleDish] PRIMARY KEY CLUSTERED ([ArticleID] ASC, [DishID] ASC),
    CONSTRAINT [FK_WineArticleDish_WineArticle] FOREIGN KEY ([ArticleID]) REFERENCES [dbo].[WineArticle] ([ArticleID]),
    CONSTRAINT [FK_WineArticleDish_WineDish] FOREIGN KEY ([DishID]) REFERENCES [dbo].[WineDish] ([DishID])
);

