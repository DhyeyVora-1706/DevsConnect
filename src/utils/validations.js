import validator from "validator";

export function validateSignUpData(req) {
  const { emailId, photoUrl } = req.body;

  if (!validator.isEmail(emailId.trim())) {
    throw new Error("Email is invalid , please verify email");
  }

  if (photoUrl) {
    if (!validator.isURL(photoUrl)) {
      throw new Error("Photo Url is invalid");
    }
  }
}

export function validateEditFieldsData(req) {
  const allowedEditFields = [
    "firstname",
    "lastname",
    "age",
    "photourl",
    "about",
    "skills",
    "gender",
  ];

  const isValidEditRequest = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field.toLowerCase())
  );

  if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
    throw new Error("PhotoURL is not valid");
  }

  return isValidEditRequest;
}
