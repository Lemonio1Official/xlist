export function f(url: string, cb: (res: [boolean, any]) => void, body: object | null = null, type: "json" | "text" = "json") {
  fetch(url, {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : null,
  })
    .then((res) => res[type]())
    .then((json) => cb(json))
    .catch((e) => console.log(e));
}
