const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

router.render = (req, res) => {
  res.jsonp({
    status: "success",
    message: "success",
    data: res.locals.data,
  });
};

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    return res.json({
      data: null,
      status: 200,
      message: "success",
    });
  }
  // Continue to JSON Server router
  next();
});

server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running");
});
