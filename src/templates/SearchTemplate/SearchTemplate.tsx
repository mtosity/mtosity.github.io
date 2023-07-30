import React, { useMemo, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { Hits, InstantSearch, SearchBox } from "react-instantsearch-hooks-web";

import { Layout } from "@/components/Layout";
import { Page } from "@/components/Page";
import { Sidebar } from "@/components/Sidebar";
import { Meta } from "@/components/Meta";
import { useSiteMetadata } from "@/hooks";
import { Link } from "gatsby";

import * as styles from "./SearchTemplate.module.scss";

function Hit({ hit }: any) {
  return (
    <Link to={hit.slug}>
      <article>{hit.title}</article>
    </Link>
  );
}

const SearchTemplate = () => {
  const searchClient = useMemo(
    () =>
      algoliasearch(
        process.env.GATSBY_ALGOLIA_APP_ID ?? "NOT_FOUND",
        process.env.GATSBY_ALGOLIA_SEARCH_KEY ?? "NOT_FOUND",
      ),
    [],
  );

  return (
    <Layout>
      <Sidebar isIndex />
      <Page>
        <InstantSearch searchClient={searchClient} indexName="Pages">
          <SearchBox
            placeholder={" Search me"}
            autoFocus
            className={styles.searchInput}
          />
          <Hits hitComponent={Hit} className={styles.hits} />
        </InstantSearch>
      </Page>
    </Layout>
  );
};

export const Head: React.FC = () => {
  const { title } = useSiteMetadata();

  return (
    <Meta title={`${title} | Search`} description={`${title} | Magic search`} />
  );
};

export default SearchTemplate;
