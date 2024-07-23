//Imports
const User = require("../../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  NotFoundError,
  IncorrectPasswordError,
  EmailAlreadyExistsError,
} = require("../../customErrors/customErrorClass");
const {
  createNewUser,
  checkUserExist,
  checkCredentials,
} = require("../../services/userServices");
const userSchema = require("../../models/userSchema");

jest.mock("../../models/userSchema");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

//Test - checkExistUser
describe("Check user Exist", () => {
  it("should return a email if exist", async () => {
    const email = "manip8072@gmail.com";
    const mockUser = { email, name: "User-1" };
    //Mocking the User.findOne

    User.findOne.mockResolvedValue(mockUser);

    //calling the function
    const existUser = await checkUserExist(email);
    expect(existUser).toEqual(mockUser);
  });

  it("should return undefined if email doesn't exist", async () => {
    const email = " demomail@gmail.com";
    //Mocking the user.findOne
    User.findOne.mockResolvedValue(null);
    //call the function
    const existUser = await checkUserExist(email);
    //Assertion
    expect(existUser).toBeUndefined();
  });
});

//Test - createNewUser
describe("createNewUser", () => {
  //Throw an EmailExist Error upon userExist
  it("should throw an emailAlreadyExistsError upon exist user", async () => {
    const fname = "Mani";
    const lname = "Prakash";
    const email = "manip8072@gmail.com";
    const password = "Password";

    const mockUser = {
      email,
      name: "Mani",
    };
    //Mocking the checkUserExist
    User.findOne.mockResolvedValue(mockUser);
    //Call function
    await expect(createNewUser(fname, lname, email, password)).rejects.toThrow(
      new EmailAlreadyExistsError("Email already Exist. Please Login")
    );
  });
  //Creating new user
  it("should create new user if the email does not exist ", async () => {
    const fname = "Mani";
    const lname = "Prakash";
    const email = "manip8072@gmail.com";
    const password = "Password";
    const salt = "saltvalue";
    const hashedPassword = "hashedpassword";

    //Creating a mockedNewUser
    const mockUser = {
      first_name: fname,
      last_name: lname,
      email: email,
      password: hashedPassword,
    };

    //Mocking the checkEmailAlreadyExist
    User.findOne.mockResolvedValue(null);
    //Mocking the bcrypt functions
    bcrypt.genSalt.mockResolvedValue(salt);
    bcrypt.hash.mockResolvedValue(hashedPassword);

    //Mocking the User.Create
    User.create.mockResolvedValue(mockUser);

    //Call the function
    const newUser = await createNewUser(fname, lname, email, password);

    //Assertion
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    expect(User.create).toHaveBeenCalledWith({
      first_name: fname,
      last_name: lname,
      email: email,
      password: hashedPassword,
    });
    expect(newUser).toEqual(mockUser);
  });
});

describe("CheckCredentials", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return an NotFoundError if email doesn't exist", async () => {
    const email = "mani@gmail.com";
    const password = "password";

    //Mocking the User.findOne
    User.findOne.mockResolvedValue(null);

    //call the function
    await expect(checkCredentials(email, password)).rejects.toThrow(
      new NotFoundError("Email not found")
    );
  });
  it("should generate a token upon checking the email and password is correct", async () => {
    const email = "mani@gmail.com";
    const password = "password";
    const token = "cxkvjbheoifslkvjpesfofov";

    const mockUser = {
      _id: "UserId1",
      email,
      password: "hashedPassword",
    };

    const returnObj = {
      statusCode: 200,
      status: "Login Success",
      token: token,
    };
    //Mocking the user.findOne
    User.findOne.mockResolvedValue(mockUser);

    //Mocking the bcrypt.compare
    bcrypt.compare.mockResolvedValue(true);

    //Mocking the generate token
    jwt.sign.mockReturnValue(token);
    //call the function
    const result = await checkCredentials(email, password);
    //Assertions
    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "5h",
      }
    );
    await expect(result).toEqual(returnObj);
  });

  it("should return incorrectPasswordError upon password is wrong...", async () => {
    const email = "mani@gmail.com";
    const password = "password";

    const mockUser = {
      id: "UserId1",
      email,
      password: "HashedPassword",
    };

    //Mocking the user.FindOne
    User.findOne.mockResolvedValue(mockUser);

    //Mocking the bcrypt.compare
    bcrypt.compare.mockReturnValue(false);

    //Assertions
    await expect(checkCredentials(email, password)).rejects.toThrow(
      new IncorrectPasswordError("Incorrect password . Check password")
    );
  });
});
