import { CRUX_API_URL } from "@/utils"

export async function POST(req) {
  try {
    const body = await req.json()
    const { origins } = body

    if (!origins || !Array.isArray(origins)) {
      return new Response(
        JSON.stringify({ error: "Invalid input. Provide an array of URLs." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const results = await Promise.all(
      origins.map(async (origin) => {
        try {
          const response = await fetch(
            `${CRUX_API_URL}?key=${process.env.CRUX_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ origin }),
            }
          )

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(JSON.stringify(errorData))
          }

          const data = await response.json()
          return { origin, record: data.record }
        } catch (error) {
          return { origin, error: error.message }
        }
      })
    )

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching CrUX data:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
