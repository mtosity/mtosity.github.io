const escapeStringRegexp = require("escape-string-regexp");

const pagePath = `content`;
const indexName = `Pages`;

const pageQuery = `{
    pages: allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/${escapeStringRegexp(pagePath)}/" },
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
          }
          fields {
            slug
          }
          excerpt(pruneLength: 1000)
        }
      }
    }
  }`;

interface PageToAlgoliaRecordInput {
  node: {
    id: string;
    frontmatter: Record<string, any>;
    fields: Record<string, any>;
  };
}

function pageToAlgoliaRecord(
  { node: { id, frontmatter, fields, ...rest } }: PageToAlgoliaRecordInput,
  index: number,
) {
  return {
    ...fields,
    ...rest,
    ...frontmatter,
    objectID: String(index),
  };
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }: any) => data.pages.edges.map(pageToAlgoliaRecord),
    indexName,
    settings: { attributesToSnippet: [`excerpt:20`] },
  },
];

module.exports = queries;
