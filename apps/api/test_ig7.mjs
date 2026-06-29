import instagramGetUrl from 'instagram-url-direct';

async function test() {
  try {
    const links = await instagramGetUrl('https://www.instagram.com/p/DB07L3nB3aX/');
    console.log(links);
  } catch(e) {
    console.error(e);
  }
}

test();
