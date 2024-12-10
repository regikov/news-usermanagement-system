import type { Request, Response } from 'express';
import { fetchFromNewsAPI, formatArticlesResponse } from '../../utils.js';
import type { IArticles, PaginatedResults } from 'src/types/types.js';
const getLatestNews = async (req: Request, res: Response) => {
  const { q, limit, sortBy } = req.query;
  try {
    const news = await fetchFromNewsAPI('/everything', { q, limit, sortBy });
    res.status(200).send(news.articles);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in getting the latest News', error });
  }
};

const getPersonalizedNews = async (req: Request, res: Response) => {
  const { category, limit, page } = req.query;

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  try {
    const news = await fetchFromNewsAPI('/top-headlines', {
      category,
      pageSize: limitNumber,
      page: pageNumber,
    });

    const paginatedArticles: PaginatedResults<IArticles> =
      formatArticlesResponse(news.articles, pageNumber, limitNumber);

    res.status(200).send({
      articles: paginatedArticles.data,
      currentPage: paginatedArticles.currentPage,
      totalPages: paginatedArticles.totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in getting personalized news', error });
  }
};

const getTopHeadlines = async (req: Request, res: Response) => {
  const { country, category, limit } = req.query;
  try {
    const news = await fetchFromNewsAPI('/top-headlines', {
      country,
      category,
      pageSize: limit,
    });

    const transformedArticles = news.articles.map(
      (
        article: {
          title: unknown;
          description: unknown;
          url: unknown;
          source: { name: unknown };
          publishedAt: unknown;
        },
        index: number,
      ) => ({
        id: `news${index + 1}`,
        title: article.title,
        description: article.description,
        url: article.url,
        source: article.source.name,
        publishedAt: article.publishedAt,
      }),
    );

    res.status(200).send(transformedArticles);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in getting the top headlines', error });
  }
};

const getSources = async (req: Request, res: Response) => {
  const { language, country, category } = req.query;

  try {
    const sources = await fetchFromNewsAPI('/sources', {
      language,
      country,
      category,
    });
    res.status(200).send(sources.sources);
  } catch (error) {
    res.status(500).send({ message: 'Error in getting News Sources', error });
  }
};

const getSearchResults = async (req: Request, res: Response) => {
  const { q, from, to, sortBy } = req.query;
  try {
    const articles = await fetchFromNewsAPI('/everything', {
      q,
      from,
      to,
      sortBy,
    });
    res.status(200).send(articles.articles);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error in fetching search results', error });
  }
};

export default {
  getLatestNews,
  getTopHeadlines,
  getSources,
  getSearchResults,
  getPersonalizedNews,
};
