// Next.js App Router (app/card/[id]/page.jsx)
// Dynamic Open Graph & Twitter Card Metadata Generator

export async function generateMetadata({ params }) {
  const cardId = params.id;
  
  // Fetch card record details from MongoDB API endpoint
  const res = await fetch(`https://your-api.com/api/cards/${cardId}`, { cache: 'no-store' });
  const card = await res.json();

  const title = `HackerHouse Goa 2026 | ${card.name || 'Builder'}'s Card`;
  const description = `Just minted my official HH Goa 2026 builder card! #FrameInGoa`;
  const imageUrl = card.imageUrl || 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://hhgoa2026.dev/card/${cardId}`,
      siteName: 'HackerHouse Goa 2026',
      images: [
        {
          url: imageUrl, // Cloudinary Hosted Image URL
          width: 1200,
          height: 630,
          alt: `HH Goa Builder Card - ${card.name}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      site: '@HackerHouseGoa',
      creator: '@HackerHouseGoa',
      images: [imageUrl], // Cloudinary Image URL for X Card Preview
    },
  };
}

export default function CardPage({ params }) {
  return (
    <main style={{ padding: '2rem', textAlign: 'center', background: '#020617', color: '#fff' }}>
      <h1>HackerHouse Goa 2026 Builder Card</h1>
      <p>Card ID: {params.id}</p>
    </main>
  );
}
