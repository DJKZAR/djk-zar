import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { createServer } from "node:http";

const root = resolve(new URL("../dist/", import.meta.url).pathname);
const port = Number(process.env.PORT || 4173);
const redirects = new Map([
  ["/wp-content/uploads/2021/06/Gedragsregels-en-vertrouwenspersoon-DJK-ZAR-20210620.pdf", "/assets/documents/gedragsregels-en-vertrouwenspersoon.pdf"],
  ["/wp-content/uploads/2023/05/Machtiging-D.J.K.pdf", "/assets/documents/machtiging-djk.pdf"],
  ["/en/", "/en/water-polo-amsterdam/"],
  ["/elementor-802/", "/gedragsregels/"],
  ["/en/sponsors-2/", "/en/sponsors/"]
]);
const types = new Map([
  [".avif", "image/avif"],
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"]
]);

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const alias = [...redirects].find(([from]) => url.pathname === from || url.pathname === from.slice(0, -1));
    if (alias) {
      url.pathname = alias[1];
      response.writeHead(301, { Location: `${url.pathname}${url.search}` }).end();
      return;
    }
    if (!url.pathname.endsWith("/") && !extname(url.pathname)) {
      response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
      return;
    }

    const path = decodeURIComponent(url.pathname);
    const requested = path.endsWith("/") ? `${path}index.html` : path;
    let file = resolve(join(root, requested.slice(1)));
    let status = 200;
    if (!file.startsWith(`${root}/`) || requested.split("/").some((part) => part.startsWith("."))) {
      file = join(root, "404.html");
      status = 404;
    } else {
      try {
        if (!(await stat(file)).isFile()) throw new Error("Not a file");
      } catch {
        file = join(root, "404.html");
        status = 404;
      }
    }

    response.writeHead(status, {
      "Content-Type": types.get(extname(file)) || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400).end("Bad request");
  }
}).listen(port, () => console.log(`Preview: http://localhost:${port}`));
