import axios from 'axios';
import { z } from 'zod';

import { CoverLabelValues, SearchResults } from 'types';
import { isFulfilled } from 'utils';

const GOOGLE_URL = 'https://www.googleapis.com';

const googleBooksApi = z.object({
  data: z.object({
    items: z.array(
      z.object({
        volumeInfo: z.object({
          title: z.string(),
          authors: z.array(z.string()).optional(),
          industryIdentifiers: z
            .array(z.object({ type: z.string(), identifier: z.string() }))
            .optional(),
          imageLinks: z
            .object({
              smallThumbnail: z.string().url(),
              thumbnail: z.string().url(),
            })
            .optional(),
        }),
      }),
    ),
  }),
});

// Function to get the poster image of a movie
export const getBookCovers = async (
  bookTitles: CoverLabelValues,
): Promise<SearchResults> => {
  const posters = await Promise.allSettled(
    bookTitles.map((bookTitle) => {
      return axios.get(`${GOOGLE_URL}/books/v1/volumes`, {
        params: bookTitle.subtitle
          ? {
              q: `intitle:${bookTitle.title}+inauthor:${bookTitle.subtitle}`,
            }
          : {
              q: `intitle:${bookTitle.title}`,
            },
      });
    }),
  );

  return posters.flatMap((result, index) => {
    if (isFulfilled(result)) {
      const {
        data: { items },
      } = googleBooksApi.parse(result.value);
      if (items.length > 0 && items[0].volumeInfo.imageLinks) {
        const isbm = items[0].volumeInfo.industryIdentifiers?.find(
          (identifier: { type: string }) => identifier.type === 'ISBN_13',
        )?.identifier;

        if (isbm) {
          return {
            link: `https://covers.openlibrary.org/b/isbn/${isbm}-M.jpg`,
            title: items[0].volumeInfo.title,
            subtitle: items[0].volumeInfo.authors?.join(', ') ?? '',
            index,
          };
        }
      }
    }
    return [];
  });
};
