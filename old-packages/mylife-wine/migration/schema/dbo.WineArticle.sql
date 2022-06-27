CREATE TABLE [dbo].[WineArticle] (
    [ArticleID]                    BIGINT         IDENTITY (1, 1) NOT NULL,
    [ArticleName]                  NVARCHAR (MAX) NOT NULL,
    [ArticleTypeID]                BIGINT         NOT NULL,
    [ArticleRegionID]              BIGINT         NOT NULL,
    [ArticleOwner]                 NVARCHAR (MAX) NOT NULL,
    [ArticleGrapeVariety]          NVARCHAR (MAX) NULL,
    [ArticleAlcoholContent]        FLOAT (53)     NULL,
    [ArticleBeginYearRelative]     INT            NOT NULL,
    [ArticleEndYearRelative]       INT            NOT NULL,
    [ArticleSparkling]             BIT            NOT NULL,
    [ArticleQuality]               INT            NOT NULL,
    [ArticleBottleCountThreshold]  INT            NOT NULL,
    [ArticleServingTemperatureMin] INT            CONSTRAINT [DF_WineArticle_ArticleServingTemperatureMin] DEFAULT ((0)) NOT NULL,
    [ArticleServingTemperatureMax] INT            CONSTRAINT [DF_WineArticle_ArticleServingTemperatureMax] DEFAULT ((0)) NOT NULL,
    [ArticleDecanting]             BIT            CONSTRAINT [DF_WineArticle_ArticleDecanting] DEFAULT ((0)) NOT NULL,
    [ArticleComment]               TEXT           NULL,
    CONSTRAINT [PK_WineArticle] PRIMARY KEY CLUSTERED ([ArticleID] ASC),
    CONSTRAINT [FK_WineArticle_WineRegion] FOREIGN KEY ([ArticleRegionID]) REFERENCES [dbo].[WineRegion] ([RegionID]),
    CONSTRAINT [FK_WineArticle_WineType] FOREIGN KEY ([ArticleTypeID]) REFERENCES [dbo].[WineType] ([TypeID])
);

