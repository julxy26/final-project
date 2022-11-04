import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getPostsByUserId, Post } from '../../../database/posts';
import { getUserBySessionToken } from '../../../database/users';

type Props = {
  posts: Post;
};

function addNewPost() {}

export default function UserPosts(props: Props) {
  const [title, setTitle] = useState('');

  return (
    <div>
      <Head>
        <title>My Posts</title>
        <meta name="description" content="My Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>My Posts</h1>

      {props.posts === null ? (
        <div>
          <p>There are no posts yet</p>
        </div>
      ) : (
        props.posts.map((post) => {
          return (
            <div key={`post-${post.id}`}>
              <Image
                src="/placeholder2.jpg"
                width="80px"
                height="80px"
                alt=""
              />
              <h3>
                <Link href={`/profile/my-posts/${post.id}`}>{post.title}</Link>
              </h3>

              <div>price: {post.price}</div>
              <div>description: {post.description}</div>
            </div>
          );
        })
      )}

      <button
        onClick={() => {
          addNewPost();
        }}
      >
        Add new post
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (user) {
    const userId = user.id;
    const posts = await getPostsByUserId(userId);

    return {
      props: {
        posts: posts || null,
      },
    };
  }
}
