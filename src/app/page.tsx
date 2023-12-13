import { kv } from '@vercel/kv';
import { revalidateTag, unstable_noStore } from 'next/cache';

const ITEMS_KEY = 'items';
const ITEM_KEY  = 'item';

export default async function Home() {
  unstable_noStore();

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
          className="rounded-md border border-gray-300 text-black px-4 py-2"
          name={ITEM_KEY}
          placeholder="New to do item text"
        />
        <button
          type="submit"
          className="border border-gray-500 rounded-md px-4 py-2"
        >
          Add
        </button>
      </form>
      {items.length > 0 &&
        <div className="space-y-2">
          <div>ITEMS ({items.length})</div>
          <ul className="space-y-2">
            {items?.map((item, index) =>
              <li key={index}>
                <form
                  className="flex space-x-1"
                  action={async (formData: FormData) => {
                    'use server';
                    kv.lrem(ITEMS_KEY, 0, formData.get(item));
                    revalidateTag('/');
                  }}
                >
                  <input
                    type="text"
                    className="!m-0 !p-0 bg-black text-white outline-none border-none"
                    name={item}
                    value={item}
                  />
                  <button
                    type="submit"
                    className="text-red-400"
                  >
                    ×
                  </button>
                </form>
              </li>)}
          </ul>
        </div>}
    </div>
  )
}
