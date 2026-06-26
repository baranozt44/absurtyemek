import { NextFunction, Request, Response } from 'express';
import { createClient, User } from '@supabase/supabase-js';
import WebSocket from 'ws';

declare global {
  namespace Express {
    interface Request {
      authUser?: User;
    }
  }
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      realtime: {
        transport: WebSocket as never,
      },
    })
  : null;

const getBearerToken = (req: Request) => {
  const authHeader = req.header('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice('Bearer '.length).trim();
};

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Supabase Auth ayarlari eksik.' });
  }

  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Oturum gerekli.' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Gecersiz oturum.' });
  }

  req.authUser = data.user;
  next();
};

export const optionalUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!supabase) {
    return next();
  }

  const token = getBearerToken(req);
  if (!token) {
    return next();
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (!error && data.user) {
    req.authUser = data.user;
  }
  next();
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey && req.header('x-admin-key') === adminKey) {
    return next();
  }

  await requireUser(req, res, () => {
    if (req.authUser?.app_metadata?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin yetkisi gerekli.' });
    }

    next();
  });
};
