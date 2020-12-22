class Users {
    constructor(username, birthdate, age, email, password, valid){
        this.username = username;
        this.birthdate = birthdate;
        this.age = age;
        this.email = email;
        this.password = password;
        this.valid = valid;
    }
}

let dummyUsers = [
    new Users("Cloe Davis","05/01/1975", 44, "chloe.davis@email.com", "bongo", false),
    new Users("Addison Moore","10/06/1981",38,"addison.moore@email.com","reeves",false),
    new Users("Gabriella Taylor","02/01/1983",36,"gabriella.taylor@email.com","yeaa!",false)
];

module.exports = dummyUsers;