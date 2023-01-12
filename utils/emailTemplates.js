require('dotenv/config');

const signupEmail = (userName, userEmail, userPassword, urlForLogin) => {
    return (`
     <main style="margin:0; padding:0; box-sizing: border-box; 
     display: flex; justify-content:center; align-items:center; 
     background: #0088cc40;  min-height: 100vh;">
            <section style="width:40vw; background-image: linear-gradient(to bottom right, #ec407b, #ff7d94);
            border-radius:1vh;   text-align: center; box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.3); 
            backdrop-filter: blur(15px); border-top: 1px solid #ff97ba; font-family: sans-serif; font-size: 20px;">
                <div style="padding: 2vw; color: #fff; ">
                    <span style="font-size: 25px; font-family: 'Open Sans', sans-serif; margin: 2vh">Welcome ${userName}</span>
                    <p style="line-height: 1.6;">Your account has been created on the 
                        <a style="text-decoration: none; color: #fff;" href="${urlForLogin}">todo list</a>. Below are your credentials.
                        <strong style="display: block;font-weight:normal;">Email:</strong>
                    ${userEmail}
                        <strong style="display: block;font-weight:normal;">Password:</strong>
                    ${userPassword}
                    </p>
                </div>
                <div style="padding: 25px;">
                    <a href='${urlForLogin}' title='Login' style="text-decoration: none; position: relative; 
                    padding: 10px 20px; color: #fff; border: 1px solid #fff; border-radius: 1vw;" 
                    target="_blank"><span>Login your Account!</span></a>
      </div>
    </section>
  </main>
`
)
}

const resetPasswordEmail = (userName, urlForReset, token) => {
    return (`
     <main style="margin:0; padding:0; box-sizing: border-box; 
     display: flex; justify-content:center; align-items:center; 
     background: #0088cc40;  min-height: 100vh;">
            <section style="width:40vw; background-image: linear-gradient(to bottom right, #ec407b, #ff7d94);
            border-radius:1vh;   text-align: center; box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.3); 
            backdrop-filter: blur(15px); border-top: 1px solid #ff97ba; font-family: sans-serif; font-size: 20px;">
                <div style="padding: 2vw; color: #fff; ">
                    <span style="font-size: 25px; font-family: 'Open Sans', sans-serif; margin: 2vh">Hi ${userName}</span>
                    <p style="line-height: 1.6;">You requested a password reset
                        <p>Click this <a style="color: #fff;" href="${urlForReset}/${token}">link</a>
                    </p>
                </div>
                <div style="padding: 25px; color: #fff;">
                    <p>If you didn't request password reseting just ignore this email!</p>
      </div>
    </section>
  </main>
`)
};

const successfulPasswordResetEmail = (userName, userPassword, urlForLogin) => {
    return (`
     <main style="margin:0; padding:0; box-sizing: border-box; 
     display: flex; justify-content:center; align-items:center; 
     background: #0088cc40;  min-height: 100vh;">
            <section style="width:40vw; background-image: linear-gradient(to bottom right, #ec407b, #ff7d94);
            border-radius:1vh;   text-align: center; box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.3); 
            backdrop-filter: blur(15px); border-top: 1px solid #ff97ba; font-family: sans-serif; font-size: 20px;">
                <div style="padding: 2vw; color: #fff; ">
                    <span style="font-size: 25px; font-family: 'Open Sans', sans-serif; margin: 2vh">Hi ${userName}</span>
                    <p style="line-height: 1.6;">You successfully changed password! Below are your credentials.
                        <strong style="display: block;font-weight:normal;">Password:</strong>
                    ${userPassword}
                    </p>
                </div>
                <div style="padding: 25px;">
                    <a href='${urlForLogin}' title='Login' style="text-decoration: none; position: relative; 
                    padding: 10px 20px; color: #fff; border: 1px solid #fff; border-radius: 1vw;" 
                    target="_blank"><span>Login your Account!</span></a>
      </div>
    </section>
  </main>
`)
};

// exports {signupEmail, resetPasswordEmail}
exports.signupEmail = signupEmail;
exports.resetPasswordEmail = resetPasswordEmail;
exports.successfulPasswordResetEmail = successfulPasswordResetEmail;
