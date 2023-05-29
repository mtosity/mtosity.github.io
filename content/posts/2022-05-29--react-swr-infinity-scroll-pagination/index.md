---
template: post
slug: "/posts/react-swr-infinity-scroll-pagination"
draft: false
socialImage: "./media/thumbnail.png"
title: Implement infinite scroll pagination in Typescript ReactJS/NextJS hook
date: 2022-05-29T00:00:00Z
description: Use useSWRInfinite and IntersectionObserver to implement infinite scroll pagination in React
category: ReactJS
tags:
  - ReactJS
  - NextJS
  - Web development
---

There are 3 main types of UI pagination:

- Pagination with page numbers

- Infinite scroll

- Click to load more

![pagination-types](/media/types.png)

In this article, we will focus on infinite scroll pagination. We will use [SWR](https://swr.vercel.app/) to fetch data and [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when the user has scrolled to the bottom of the page.

## What is SWR?

SWR is a React Hooks library for remote data fetching. You don't necessary need to use SWR to implement infinite scroll pagination, could just use fetch, axios or other fetching libraries. But SWR is a great tool for fetching data, it has a lot of useful features such as caching, revalidation, polling, etc.

## What is IntersectionObserver?

IntersectionObserver is a browser API that allows you to detect when an element is visible in the viewport. It is a great tool for implementing infinite scroll pagination.

## How to use SWR to implement infinite scroll pagination in React

Just lay out all the code first then we will discuss below, in this example I want to fetch all the issues from the [React Github repo](https://github.com/facebook/react)

```javascript
// useScrollInfity.js
import { useEffect, useMemo, useRef } from "react";
import useSWRInfinite from "swr/infinite";

const fetcher = (url: string) =>
  fetch(url, {
    // headers: {
    //   authorization: "Bearer {GITHUB_TOKEN}", // if you need to use a token to bypass rate limit
    // },
  }).then((res) => res.json());
const PAGE_SIZE = 20;

type DataType = any;

export function useScrollInfity() {
  const { data, mutate, setSize, isValidating, isLoading } =
    useSWRInfinite <
    DataType >
    ((index) =>
      `https://api.github.com/repos/facebook/react/issues?per_page=${PAGE_SIZE}&page=${
        index + 1
      }`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateFirstPage: false,
    });
  const loadMoreRef = useRef(null);
  const isEnd = data?.[data?.length - 1]?.length < PAGE_SIZE;

  useEffect(() => {
    const handleObserver: IntersectionObserverCallback = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isValidating && !isEnd) {
        setSize((size) => {
          return size + 1;
        });
      }
    };
    const observer = new IntersectionObserver(handleObserver);

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isValidating, isEnd, setSize]);

  return { loadMoreRef, data, mutate, isValidating, isLoading };
}
```

```javascript
// App.tsx
import * as React from "react";
import "./App.css";
import { useScrollInfity } from "./useScrollInfinity";

function App() {
  const { data, loadMoreRef, isValidating } = useScrollInfity();
  const issues: any[] = data ? [].concat(...data) : [];

  return (
    <div className="App">
      <h1>List of facebook/react issues</h1>
      {issues.map((issue) => {
        return (
          <p key={issue.id} style={{ margin: "6px 0" }}>
            - {issue.title}
          </p>
        );
      })}
      {isValidating && <p style={{ color: "yellow" }}>...loading</p>}
      <div ref={loadMoreRef} />
    </div>
  );
}

export default App;
```

### Explanation

High level: we create an element observer, and when the observer detects that the element is visible in the viewport (meaning we reached the end), we will call `setSize` to increase the page number by 1.

`const isEnd = data?.[data?.length - 1]?.length < PAGE_SIZE;` is used to check if we have reached the end of the list.

`keepPreviousData: true` is used to keep the previous data when we call _setSize_ to increase the page number by 1. Without this, all the previous data fetched in all previous pages will be removed.

`revalidateFirstPage: false` is used to prevent SWR from revalidating the first page when we call _setSize_ to increase the page number by 1. If you have a lot of data in the first page (people creating a lot of new data), you should set this to true.

`mutate` is used to mutate the data, it is useful when you want to update the data both offline state and refetching to validating the data.

`isValidating` becomes true whenever there is an ongoing request whether the data is loaded or not

`isLoading` becomes true when there is an ongoing request and data is not loaded yet.

## Conclusion

In this article, we have learned how to use SWR and IntersectionObserver to implement infinite scroll pagination in React. You can find the full source code [here](https://codesandbox.io/p/sandbox/react-swr-usescrollinfity-useswrinfinite-bwg7kg)

I made an [PR](https://github.com/LAION-AI/Open-Assistant/pull/2860) to open source Open-Assistant project, the backend used the cursor-based pagination, and the frontend used the infinite scroll pagination. You can check it out!

## References

- [SWR](https://swr.vercel.app/)
