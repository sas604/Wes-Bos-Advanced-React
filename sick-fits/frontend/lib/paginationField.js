import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false,

    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // Read the numbers of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((item) => item);
      // If there are items  and aren't enough items and we are on the last page
      // Then Just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // We don't have any items, we must go to the network to fetch them
        return false;
      }

      // If there are items, just return them from the cache, and we don't need to go to the network
      if (items.length) {
        console.log(items.length);
        return items;
      }
      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip } = args;
      // This runs when appolo client returns from network
      const merged = existing ? existing.slice(0) : [];
      // eslint-disable-next-line
      for (let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      return merged;
    },
  };
}
