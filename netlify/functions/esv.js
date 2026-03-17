export async function handler(event) {
  const apiKey = process.env.ESV_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: "Missing ESV API key",
    };
  }

  const ref = event.queryStringParameters.q;

  if (!ref) {
    return {
      statusCode: 400,
      body: "Missing query parameter 'q'",
    };
  }

  try {
    const url = new URL("https://api.esv.org/v3/passage/text/");
    url.searchParams.set("q", ref);
    url.searchParams.set("include-verse-numbers", "false");
    url.searchParams.set("include-footnotes", "false");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Token ${apiKey}`,
      },
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: "Failed to fetch from ESV API",
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Server error",
    };
  }
}