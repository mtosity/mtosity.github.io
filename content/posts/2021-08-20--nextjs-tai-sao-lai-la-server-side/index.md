---
template: post
slug: "/posts/nextjs-how-and-when"
draft: false
socialImage: "./media/nextjs-logo.png"
title: Những features của Nextjs, khi nào nên sử dụng và cách sử dụng chúng
date: 2021-08-20T10:59:05.941Z
description: Những features mà Nextjs support mà tạo nên thương hiệu của next
category: NextJS
tags:
  - ReactJS
  - NextJS
  - Web development
---

Lượm content từ https://nextjs.org/docs/getting-started và dịch sang tiếng lòng

`yarn create next-app --typescript`

# Pages

Directory một page bình thường: `pages/posts.js`
Dynamic routes: `pages/posts/[id].js`

## Pre-rendering

Default thì NextJS pre-render tất cả trang -> tốt cho performance và SEO

Mỗi page được tạo HTML riêng với một tí JS, khi html load thì js chạy để trang có thể nhấn nhá được

## Two forms of Pre-rendering

- Static Generation (recommended): tạo sẵn HTML khi `yarn build`

- Server-side rendering: tạo HTML khi request một trang

Nên dùng SG thay vì SSG vì những trang HTML đó có thể cache bằng CDN để tăng performance

## Static Generation

Without data thì chả có j để nói

With data thì ta có 2 functions của nextjs để làm việc này

1. Khai báo _content_ (data bên ngoài) thông qua hàm `getStaticProps`

fetch data bên ngoài và nhúng vào HTML

2. Khai báo _paths_ (những đường dẫn có thể có) thông qua hàm `getStaticPaths`

Ví dụ khai báo paths của những bài _post_ thì ta phải fetch data tất cả các ids của các bài _post_ và nextjs sẽ tự tạo đường dẫn. Cùng với _content_ để tạo HTML lúc build

```javascript
function Post({ post }) {
  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`);
  const post = await res.json();

  // Pass post data to the page via props
  return { props: { post } };
}

export default Post;
```

Static Generation thì cần cả `getStaticProps` và `getStaticPaths` (nếu dynamic routes)

Server-side rendering thì sao, chỉ cần `getServerSideProps`, mỗi lần request sẽ chạy hàm này lấy data trước rùi trả về HTML sau, implement y như thằng `getStaticProps`

# Data fetching

## Incremental Static Regeneration

ISR giải quyết vấn đề khi bạn có một bài post mới và bạn đang dùng static generation, nó sẽ dò lại xem có trang mới nào không với thời gian là `revalidate` giây

```javascript
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export default Blog;
```

## Đọc files với `process.cwd()`

```javascript
import { promises as fs } from "fs";
import path from "path";

// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>
          <h3>{post.filename}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = await fs.readdir(postsDirectory);

  const posts = filenames.map(async (filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = await fs.readFile(filePath, "utf8");

    // Generally you would parse/transform the contents
    // For example you can transform markdown to HTML here

    return {
      filename,
      content: fileContents,
    };
  });
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts: await Promise.all(posts),
    },
  };
}

export default Blog;
```

## Một số note

`getStaticProps` và `getStaticPaths` chỉ runs lúc build

Nên dùng `getServerSideProps` khi muốn pre-render cái data để tăng SEO, nếu data quá lớn hay không cần SEO thì chỉ cần fetch ở client thôi. `getServerSideProps` chỉ chạy phía server chứ không chạy ở browser!

Dùng [preview mode](https://nextjs.org/docs/advanced-features/preview-mode) để "preview" trước bài blog/post lúc viết khi integrate với CMS

Còn fetch data ở client side (GET), thì nên dùng thư viện [swr](https://swr.vercel.app/), nó xử lý sẵn những thứ như caching, revalidation, tracking, refetching on interval

# Image Component and Image Optimization

_Chỉ version 10.0.0_

Image component từ chính `next/image`, nextjs sẽ optimize hình ảnh và default là lazy load luôn, kể cả là image từ src hay external, cực phê

Domains: phải set domain của hình ở file `next.config.js`, ngoài ra mình có thể khai báo `deviceSizes`để phục responsive hay `imageSizes` khi muốn cụ thể size cho ảnh luôn

```javascript
module.exports = {
  images: {
    domains: ["example.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

# API routes

Build cả apis trên nextjs được luôn, nó nằm ở `pages/api` và được map ở url `/api/*`, ví dụ `pages/api/user.js`

```javascript
export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}
```

Nhưng nó không có CORS headers nên chỉ gọi ở same-origin mà thôi

# Authentication

Nhìn code cóp pát thôi! :D

Authenticating Statically Generated Pages

```javascript
// pages/profile.js

import useUser from "../lib/useUser";
import Layout from "../components/Layout";

const Profile = () => {
  // Fetch the user client-side
  const { user } = useUser({ redirectTo: "/login" });

  // Server-render loading state
  if (!user || user.isLoggedIn === false) {
    return <Layout>Loading...</Layout>;
  }

  // Once the user request finishes, show the user
  return (
    <Layout>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  );
};

export default Profile;
```

Authenticating Server-Rendered Pages

```javascript
// pages/profile.js

import withSession from "../lib/session";
import Layout from "../components/Layout";

export const getServerSideProps = withSession(async function ({ req, res }) {
  // Get the user's session based on the request
  const user = req.session.get("user");

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});

const Profile = ({ user }) => {
  // Show the user. No loading state is required
  return (
    <Layout>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </Layout>
  );
};

export default Profile;
```
