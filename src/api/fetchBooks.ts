import axios from 'axios';
import { z } from 'zod';

import { CoverLabelValues, SearchResults } from 'types';
import { isFulfilled } from 'utils';

const GOOGLE_URL = 'https://www.googleapis.com';

const googleBooksApi = z.object({
  data: z.object({
    items: z.array(
      z.object({
        accessInfo: z.object({
          accessViewStatus: z.string(),
          country: z.string(),
          embeddable: z.boolean(),
          epub: z.object({ isAvailable: z.boolean() }),
          pdf: z.object({ isAvailable: z.boolean() }),
          publicDomain: z.boolean(),
          quoteSharingAllowed: z.boolean(),
          textToSpeechPermission: z.string(),
          viewability: z.string(),
          webReaderLink: z.string().url(),
        }),
        etag: z.string(),
        id: z.string(),
        kind: z.string(),
        saleInfo: z.object({
          country: z.string(),
          isEbook: z.boolean(),
          saleability: z.string(),
        }),
        searchInfo: z.object({ textSnippet: z.string() }).optional(),
        selfLink: z.string().url(),
        volumeInfo: z.object({
          title: z.string(),
          authors: z.array(z.string()).optional(),
          publisher: z.string().optional(),
          publishedDate: z.string().optional(),
          description: z.string().optional(),
          industryIdentifiers: z
            .array(z.object({ type: z.string(), identifier: z.string() }))
            .optional(),
          readingModes: z.object({ text: z.boolean(), image: z.boolean() }),
          pageCount: z.number().optional(),
          printType: z.string(),
          categories: z.array(z.string()).optional(),
          maturityRating: z.string(),
          allowAnonLogging: z.boolean(),
          contentVersion: z.string(),
          panelizationSummary: z
            .object({
              containsEpubBubbles: z.boolean(),
              containsImageBubbles: z.boolean(),
            })
            .optional(),
          imageLinks: z
            .object({
              smallThumbnail: z.string().url(),
              thumbnail: z.string().url(),
            })
            .optional(),
          language: z.string(),
          previewLink: z.string().url(),
          infoLink: z.string().url(),
          canonicalVolumeLink: z.string().url(),
        }),
      }),
    ),
    kind: z.string(),
    totalItems: z.number(),
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

  return posters
    .filter(isFulfilled)
    .map(({ value }) => googleBooksApi.parse(value))
    .flatMap(({ data: { items } }) => {
      if (items.length > 0 && items[0].volumeInfo.imageLinks) {
        const isbm = items[0].volumeInfo.industryIdentifiers?.find(
          (identifier: { type: string }) => identifier.type === 'ISBN_13',
        )?.identifier;

        if (isbm) {
          return {
            link: `https://covers.openlibrary.org/b/isbn/${isbm}-M.jpg`,
            title: items[0].volumeInfo.title,
            subtitle: items[0].volumeInfo.authors?.join(', ') ?? '',
          };
        }
      }

      return [];
    });
};
