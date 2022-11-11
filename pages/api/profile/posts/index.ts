import { NextApiRequest, NextApiResponse } from 'next';
import { createImage } from '../../../../database/images';
import { createPost, getPostsByUserId } from '../../../../database/posts';
import {
  createPostsTags,
  getAllTags,
  getTagIdByTagName,
} from '../../../../database/tags';
import { getUserBySessionToken } from '../../../../database/users';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET') {
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));

    if (user) {
      const userId = user.id;
      const posts = await getPostsByUserId(userId);

      if (!posts) {
        return response
          .status(400)
          .json({ errors: [{ message: 'no posts found' }] });
      }
      return response.status(200).json({ posts });
    }
  }

  if (request.method === 'POST') {
    const token = request.cookies.sessionToken;
    const user = token && (await getUserBySessionToken(token));

    if (user) {
      const userId = user.id;
      await getPostsByUserId(userId);
    }

    if (user) {
      const id = user.id;
      const title = request.body?.title;
      const price = request.body?.price;
      const description = request.body?.description;
      const street = request.body?.street;
      const district = request.body?.district;
      const userId = id;
      const urls = request.body?.urls;
      const tag = request.body?.tag;

      // 1. make sure the data exist
      if (
        typeof title !== 'string' ||
        typeof price !== 'number' ||
        typeof description !== 'string' ||
        typeof street !== 'string' ||
        typeof district !== 'number' ||
        !title ||
        !price ||
        !description ||
        !street ||
        !district
      ) {
        return response.status(400).json({
          errors: [{ message: 'required fields must be filled out' }],
        });
      }

      const [post] = await createPost(
        title,
        price,
        description,
        street,
        district,
        userId,
      );

      const postId = post.id;
      const [tagId] = tag && (await getTagIdByTagName(tag));

      const [postsTags] = await createPostsTags(postId, tagId.id);

      const image = await createImage(postId, urls);
      // 4. sql query to create the record

      return response.status(200).json({ post, image, postsTags });
    }
  } else {
    response.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
