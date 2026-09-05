/*
  MON HIPHOP CONTENT FILE

  IMAGE SYSTEM
  1) One local image:
     image: "assets/images/news/my-photo.jpg"

  2) One remote image:
     image: "https://example.com/my-photo.jpg"

  3) Multiple images / gallery:
     images: [
       "assets/images/news/photo-1.jpg",
       "assets/images/news/photo-2.jpg"
     ]

  4) No image:
     image: ""

  You can use any filename. There is NO fixed filename and NO fixed number
  of gallery images. You do not need to edit HTML when adding images.
*/

const PLACEHOLDER = "assets/images/placeholder.svg";

const NEWS = [
  {
    id: 1,
    title: "New Wave: The Next Sound of the City",
    artist: "Artist X",
    category: "MUSIC",
    date: "2026-09-05",
    image: "assets/images/news/example-news.jpg",
    excerpt: "A new release brings fresh energy and a different direction to the scene.",
    content: `
      <p>This is a sample article. Replace the text in <strong>js/data.js</strong> with your own story.</p>
      <p>You can add one image with <code>image</code>, or as many images as you want with <code>images</code>.</p>
    `
  },
  {
    id: 2,
    title: "Inside the New Generation of Hip-Hop",
    artist: "Artist Y",
    category: "CULTURE",
    date: "2026-09-03",
    images: [
      "assets/images/news/gallery-01.jpg",
      "assets/images/news/gallery-02.jpg",
      "assets/images/news/gallery-03.jpg"
    ],
    excerpt: "Three visual moments from a new generation pushing the culture forward.",
    content: `
      <p>This sample story demonstrates a multi-image gallery. Add or remove image paths freely.</p>
    `
  },
  {
    id: 3,
    title: "What Makes a Great Hip-Hop Release?",
    artist: "MON HIPHOP",
    category: "FEATURE",
    date: "2026-08-30",
    image: "",
    excerpt: "Production, identity, writing and the details that make a release memorable.",
    content: `
      <p>A placeholder appears automatically when an article has no image.</p>
    `
  }
];

const ARTISTS = [
  {
    id: 1,
    name: "Artist X",
    genre: "HIP-HOP / RAP",
    avatar: "assets/images/artists/artist-x.jpg",
    cover: "assets/images/artists/artist-x-cover.jpg",
    bio: "A sample artist profile. Replace this with your artist information."
  },
  {
    id: 2,
    name: "Artist Y",
    genre: "RAP / R&B",
    avatar: "assets/images/artists/artist-y.jpg",
    cover: "",
    bio: "Another sample profile with a flexible image setup."
  },
  {
    id: 3,
    name: "Artist Z",
    genre: "UNDERGROUND",
    avatar: "",
    cover: "",
    bio: "No image is required. The site will use placeholders automatically."
  }
];

const RELEASES = [
  {
    id: 1,
    title: "New Wave",
    artist: "Artist X",
    type: "SINGLE",
    date: "2026-09-05",
    cover: "assets/images/music/new-wave.jpg",
    spotify: "#",
    youtube: "#"
  },
  {
    id: 2,
    title: "City After Dark",
    artist: "Artist Y",
    type: "EP",
    date: "2026-08-29",
    cover: "assets/images/music/city-after-dark.jpg",
    spotify: "#",
    youtube: "#"
  },
  {
    id: 3,
    title: "No Cover Needed",
    artist: "Artist Z",
    type: "ALBUM",
    date: "2026-08-20",
    cover: "",
    spotify: "#",
    youtube: "#"
  }
];
