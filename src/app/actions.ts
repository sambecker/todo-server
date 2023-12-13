'use server';

import { kv } from '@vercel/kv';
import { revalidateTag } from 'next/cache';
import { ITEMS_KEY, ITEM_KEY } from './data';

export const createItem = (formData: FormData) => {
  kv.lpush(ITEMS_KEY, formData.get(ITEM_KEY));
  revalidateTag('/');
}

export const deleteItem = (formData: FormData) => {
  kv.lrem(ITEMS_KEY, 0, formData.get(ITEM_KEY));
  revalidateTag('/');
};
