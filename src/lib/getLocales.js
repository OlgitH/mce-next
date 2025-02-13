export async function getLocales(doc, client) {
  const [repository, altDocs] = await Promise.all([
    client.getRepository(),
    doc.alternate_languages.length > 0
      ? client.getAllByIDs(
          doc.alternate_languages.map((altLang) => altLang.id),
          {
            lang: "*",
            // Exclude all fields to speed up the query.
            fetch: `${doc.type}.__nonexistent-field__`,
          }
        )
      : Promise.resolve([]),
  ]);

  // Combine the original document and alternate documents
  const allDocs = [doc, ...altDocs];

  // Sort all documents by their language code alphabetically
  const sortedDocs = allDocs.sort((a, b) => {
    // Ensure English (en-gb) comes first
    if (a.lang === "en-gb") return -1;
    if (b.lang === "en-gb") return 1;

    // Otherwise, sort the rest alphabetically by language code
    return a.lang.localeCompare(b.lang);
  });

  return sortedDocs.map((doc) => {
    return {
      ...doc,
      lang_name: repository.languages.find((lang) => lang.id === doc.lang).name,
    };
  });
}
