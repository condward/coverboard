import axios from 'axios';
import { CoverLabelValues, SearchResults } from 'types';

const GOOGLE_URL = 'https://www.googleapis.com';

const isFulfilled = <T>(
  p: PromiseSettledResult<T>,
): p is PromiseFulfilledResult<T> => p.status === 'fulfilled';

// Function to get the poster image of a movie
export const getBookCovers = async (
  bookTitles: Array<CoverLabelValues>,
): Promise<Array<SearchResults>> => {
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
  const fullPosters = posters.filter(isFulfilled);

  return fullPosters.flatMap((response) => {
    const { items } = response.value.data;
    if (items && items.length > 0 && items[0].volumeInfo.imageLinks) {
      const isbm = items[0].volumeInfo.industryIdentifiers.find(
        (identifier: { type: string }) => identifier.type === 'ISBN_13',
      )?.identifier;

      if (isbm) {
        return {
          link: `https://covers.openlibrary.org/b/isbn/${isbm}-M.jpg`,
          title: items[0].volumeInfo.title,
          subtitle: items[0].volumeInfo.authors.join(', '),
        };
      }
    }

    return [];
  });
};
