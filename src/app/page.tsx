import { kv } from '@vercel/kv';
import { revalidateTag } from 'next/cache';

const ITEMS_KEY = 'items';
const ITEM_KEY  = 'item';

export default async function Home() {
  const items = await kv.lrange(ITEMS_KEY, 0, -1);

  return (
    <div className="space-y-8">
      <form
        className="flex gap-2"
        action={async (formData: FormData) => {
          'use server';
          kv.lpush(ITEMS_KEY, formData.get(ITEM_KEY));
          revalidateTag('/');
        }}
      >
        <input
          type="text"
          className="border border-gray-300 text-black rounded px-4 py-2"
          name={ITEM_KEY}
          placeholder="New to do item"
        />
        <button
          type="submit"
          className="border border-gray-300 rounded px-4 py-2"
        >
          Add
        </button>
      </form>
      {items.length > 0 &&
        <div className="space-y-2">
          <div>ITEMS ({items.length})</div>
          <ul className="ml-4">
            {items?.map((item, index) =>
              <li
                key={index}
                className="list-disc pl-2"
              >
                {item}
              </li>)}
          </ul>
        </div>}
    </div>
  )
}
