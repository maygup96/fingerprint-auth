# fingerprint-auth

# Description
This is a mobile app which registers users' biometric (fingerprints only as of yet) and uses the same for login. After successful login a user gets to see an intersting message which will make her day great with a sparkling smile!

# Steps to install
 - Download the code from the repo using git clone <url>
 - Ensure that you have the latest version of npm installed
 - In the project folder run `npm install`
 - Run `npm start` and follow the instructions
  
# How to use
  - Ensure that your device has a fingerprint sensor. If not, then this is not the best place for you :p. Sorry!
  - Please register a fingerprint with your device under device settings.
  
    `PRO TIP: Always remember the fingerprint(s) you have set. Irrespective of what the dialog in the app says, you have to use the same fingerprint `
  - If you are a first time user then please register yourself. See [Registering with the app](#registering-with-the-app)
  - If you have already registered then press on login button.
  - After successful login, a user should see the exciting message.
  
# Registering with the app
  - Press on `Register Now`.
  - This will ask the user to register all five fingers of the right hand.
  - After the registration is complete, user will be redirected to the login screen.
  
# Logging in
  - This time user will be asked to place any finger of the right hand. 
  - This process will be repeated thrice.
  - If any step out of the three fails, then the process has to be started again.  
