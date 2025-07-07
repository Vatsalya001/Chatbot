import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { getDbPool, initializeDatabase } from './utils/database';
import { requireAuth } from './utils/auth';

interface CreateCommentRequest {
  content: string;
  postId?: string;
  parentId?: number;
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: '',
    };
  }

  try {
    // Initialize database
    await initializeDatabase();
    const pool = getDbPool();

    switch (event.httpMethod) {
      case 'GET':
        return await getComments(event, pool);
      case 'POST':
        return await createComment(event, pool);
      case 'PUT':
        return await updateComment(event, pool);
      case 'DELETE':
        return await deleteComment(event, pool);
      default:
        return {
          statusCode: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Comments API error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    };
  }
};

async function getComments(event: HandlerEvent, pool: any) {
  const postId = event.queryStringParameters?.postId || 'default';
  const page = parseInt(event.queryStringParameters?.page || '1', 10);
  const limit = parseInt(event.queryStringParameters?.limit || '10', 10);
  const offset = (page - 1) * limit;

  const result = await pool.query(`
    SELECT 
      c.id,
      c.content,
      c.parent_id,
      c.post_id,
      c.created_at,
      c.updated_at,
      u.id as author_id,
      u.name as author_name,
      u.email as author_email
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at DESC
    LIMIT $2 OFFSET $3
  `, [postId, limit, offset]);

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM comments WHERE post_id = $1',
    [postId]
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      comments: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].count, 10),
        totalPages: Math.ceil(countResult.rows[0].count / limit),
      },
    }),
  };
}

async function createComment(event: HandlerEvent, pool: any) {
  try {
    const user = requireAuth(event.headers.authorization);
    const body: CreateCommentRequest = JSON.parse(event.body || '{}');
    const { content, postId = 'default', parentId } = body;

    if (!content || content.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Comment content is required',
        }),
      };
    }

    if (content.length > 1000) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Comment content must be less than 1000 characters',
        }),
      };
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentResult = await pool.query(
        'SELECT id FROM comments WHERE id = $1 AND post_id = $2',
        [parentId, postId]
      );

      if (parentResult.rows.length === 0) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({
            error: 'Parent comment not found',
          }),
        };
      }
    }

    const result = await pool.query(`
      INSERT INTO comments (content, author_id, post_id, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, content, post_id, parent_id, created_at, updated_at
    `, [content.trim(), user.id, postId, parentId || null]);

    const comment = result.rows[0];

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Comment created successfully',
        comment: {
          ...comment,
          author: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      }),
    };
  } catch (error) {
    if (error.message === 'No token provided' || error.message === 'Invalid or expired token') {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Authentication required',
        }),
      };
    }
    throw error;
  }
}

async function updateComment(event: HandlerEvent, pool: any) {
  try {
    const user = requireAuth(event.headers.authorization);
    const commentId = event.queryStringParameters?.id;
    
    if (!commentId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Comment ID is required',
        }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Comment content is required',
        }),
      };
    }

    // Check if comment exists and user owns it
    const existingComment = await pool.query(
      'SELECT id, author_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (existingComment.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Comment not found',
        }),
      };
    }

    if (existingComment.rows[0].author_id !== user.id) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'You can only edit your own comments',
        }),
      };
    }

    // Update comment
    const result = await pool.query(
      'UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [content.trim(), commentId]
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Comment updated successfully',
        comment: result.rows[0],
      }),
    };
  } catch (error) {
    if (error.message === 'No token provided' || error.message === 'Invalid or expired token') {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Authentication required',
        }),
      };
    }
    throw error;
  }
}

async function deleteComment(event: HandlerEvent, pool: any) {
  try {
    const user = requireAuth(event.headers.authorization);
    const commentId = event.queryStringParameters?.id;
    
    if (!commentId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Comment ID is required',
        }),
      };
    }

    // Check if comment exists and user owns it
    const existingComment = await pool.query(
      'SELECT id, author_id FROM comments WHERE id = $1',
      [commentId]
    );

    if (existingComment.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Comment not found',
        }),
      };
    }

    if (existingComment.rows[0].author_id !== user.id) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'You can only delete your own comments',
        }),
      };
    }

    // Delete comment (this will also delete child comments due to CASCADE)
    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Comment deleted successfully',
      }),
    };
  } catch (error) {
    if (error.message === 'No token provided' || error.message === 'Invalid or expired token') {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Authentication required',
        }),
      };
    }
    throw error;
  }
}