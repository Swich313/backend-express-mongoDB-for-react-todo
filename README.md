# backend-express-mongoDB-for-react-todo
ENDPOINTS

                                                  Auth Endpoints
POST request to /auth/signup - for signing up
body: {email, password, confirmPassword, name, loginUrl}
validation: (email: isEmail(), whether email is already exists in the DB;
             password: isStrongPassword() - 8 characters long, should contain 1 letter, 1 capital letter, 1 special symbol;
             confirmPassword: whether confirmPassword matches to password;
             name: not empty)
response: send e-mail with your credentials and link /loginUrl/ which leads to frontend login page 

POST request to /auth/login - for logging in
body: {email, password} 
response: {token: JWT, userId}

POST request to /auth/reset - for requesting password reset
body: {email, resetUrl: frontend url to reset form}
validation: (email: isEmail())
response: send e-mail with link to resetUrl/:token

PATCH request to /auth/reset - for reseting password
body: {passwod, passwordToken, loginUrl:  frontend url to login form}
validation: (password: isStrongPassword() - 8 characters long, should contain 1 letter, 1 capital letter, 1 special symbol;)
response: send e-mail with your credentials and link /loginUrl/ which leads to frontend login page

                                                   Todos Endpoint
                                                   
GET request to /todos
