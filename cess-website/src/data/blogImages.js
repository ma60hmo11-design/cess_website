const englishImageModules = import.meta.glob("../assets/BLOG_IMG/IMGE*.png", {
  eager: true,
  import: "default",
});

const arabicImageModules = import.meta.glob("../assets/BLOG_IMG/IMGA*.png", {
  eager: true,
  import: "default",
});

export function getBlogImage(lang, id) {
  const numericId = Number(id);

  if (!Number.isFinite(numericId) || numericId < 2) {
    return null;
  }

  const imageNumber = numericId - 1;

  const key =
    lang === "ar"
      ? `../assets/BLOG_IMG/IMGA${imageNumber}.png`
      : `../assets/BLOG_IMG/IMGE${imageNumber}.png`;

  return lang === "ar" ? arabicImageModules[key] || null : englishImageModules[key] || null;
}
