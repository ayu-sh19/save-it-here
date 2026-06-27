import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { prisma, MOCK_USER_ID } from '../lib/db';
import { IdeaSchema, IdeaUpdateSchema } from '@save-it-here/shared';

const ideasRouter = new Hono();

// GET /api/v1/ideas
ideasRouter.get('/', async (c) => {
  const ideas = await prisma.idea.findMany({
    where: { userId: MOCK_USER_ID },
    orderBy: { updatedAt: 'desc' },
  });
  return c.json({ data: ideas });
});

// POST /api/v1/ideas
ideasRouter.post('/', async (c) => {
  const body = await c.req.json();

  const idea = await prisma.idea.create({
    data: {
      title: body.title,
      content: body.content,
      status: body.status,
      priority: body.priority,
      userId: MOCK_USER_ID,
    },
  });

  return c.json({ data: idea }, 201);
});

// PATCH /api/v1/ideas/:id
ideasRouter.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  try {
    const idea = await prisma.idea.update({
      where: { id, userId: MOCK_USER_ID },
      data: {
        title: body.title,
        content: body.content,
        status: body.status,
        priority: body.priority,
      },
    });
    return c.json({ data: idea });
  } catch (e) {
    return c.json({ error: 'Idea not found or could not be updated' }, 404);
  }
});

export { ideasRouter };
