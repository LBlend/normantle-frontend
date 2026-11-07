export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
  }
}

export async function request<T>(
  apiRoot: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const init: RequestInit | undefined =
    body === undefined
      ? undefined
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        };

  let response: Response;
  try {
    response = await fetch(`${apiRoot}${path}`, init);
  } catch {
    throw new ApiError(0, "Network error");
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(response.status, String(data?.detail ?? ""));
  }

  return response.json();
}

export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 0:
        return "Fikk ikke kontakt med serveren. Sjekk internettforbindelsen og prøv igjen";
      case 400:
        if (error.message === "No closer words available") {
          return "Du kan ikke motta flere hint!";
        }
        return "Dagens ord har endret seg. Last inn siden på nytt";
      case 404:
        return "Ordet finnes ikke/er fjernet fra ordlisten";
      case 422:
        return "Ugyldig ord";
      case 429:
        return "Du gjetter for fort! Vent litt og prøv igjen";
    }
  }
  return "Noe gikk galt! Prøv igjen senere";
}
