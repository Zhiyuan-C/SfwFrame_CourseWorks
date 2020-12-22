module.exports = (http) => {
  let server = http.listen(3000, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log("Server listening on: " + host + " port: " + port);
  });
}

