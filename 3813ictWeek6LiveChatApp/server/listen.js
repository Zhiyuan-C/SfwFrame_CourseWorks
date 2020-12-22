module.exports = {
    listen: (app, PORT)=>{
        app.listen(PORT, ()=>{
            let date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            console.log(`Server started on port ${PORT} at ${hours}:${minutes}`);
            // console.log("Server started on port " + PORT + "at");
        });
    }
}